import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import Groq from "groq-sdk";
import {
  shows,
  episodes,
  categories,
  historicTopics,
  getShowById,
  getShowsByCategory,
  getEpisodeById,
  getEpisodesByShow,
  searchEpisodesByTopic,
  searchEpisodesByKeyword,
  getActiveShows,
  getCategoryById,
  type PodcastEpisode,
  type PodcastShow
} from "./radiobh-knowledge.js";

const ModelEnum = z.enum(["compound-beta", "compound-beta-mini"]);
const ModeEnum = z.enum(["minimal", "verbose"]);

// Define Tool Schemas for Radio BH
export const searchEpisodesArgsSchema = z.object({
  query: z.string().describe("Search query for episodes (searches in title, description, and topics)"),
  showId: z.string().optional().describe("Optional: Filter by specific show ID"),
});

export const getShowInfoArgsSchema = z.object({
  showId: z.string().describe("The ID of the show to get information about"),
});

export const listShowsArgsSchema = z.object({
  categoryId: z.string().optional().describe("Optional: Filter shows by category ID"),
  activeOnly: z.boolean().optional().default(true).describe("Only return active shows (default: true)"),
});

export const getEpisodeInfoArgsSchema = z.object({
  episodeId: z.string().describe("The ID of the episode to get information about"),
});

export const searchTopicsArgsSchema = z.object({
  topic: z.string().describe("Topic to search for in the historical archive"),
});

export const askCodingQuestionArgsSchema = z.object({
  question: z.string().describe("Coding question related to technologies discussed on Radio BH (Laravel, PHP, TypeScript, React, Node.js, etc.)"),
  context: z.string().optional().describe("Optional: Additional context about the question"),
  model: ModelEnum.optional()
    .default("compound-beta")
    .describe("The model to use (compound-beta or compound-beta-mini). Defaults to compound-beta."),
});

// Original Groq Tool Schemas (kept for backward compatibility)
export const realtimeToolArgsSchema = z.object({
  question: z.string().describe("The question to ask the model, especially if it requires real-time information (e.g., current news, recent events)."),
  model: ModelEnum.optional()
    .default("compound-beta")
    .describe("The model to use (compound-beta or compound-beta-mini). Defaults to compound-beta. Use compound-beta-mini for quick answers."),
  mode: ModeEnum.optional().default("minimal").describe("Response mode ('minimal' or 'verbose'). Defaults to 'minimal'. 'verbose' includes executed tools in the response. This is very verbose and should only be used when the user asks for it or when the user query cannot be answered without it (always first try without it)."),
  include_domains: z.array(z.string()).optional().describe("List of domains to specifically include in the search."),
  exclude_domains: z.array(z.string()).optional().describe("List of domains to exclude from the search."),
});

export const replToolArgsSchema = z.object({
    question: z.string().describe("The question to ask the model, especially one that benefits from Python REPL interaction (e.g., for intermediate calculations or code execution)."),
    model: ModelEnum.optional()
      .default("compound-beta")
      .describe("The model to use (compound-beta or compound-beta-mini). Defaults to compound-beta. Use compound-beta-mini for quick answers."),
    mode: ModeEnum.optional().default("minimal").describe("Response mode ('minimal' or 'verbose'). Defaults to 'minimal'. 'verbose' includes executed tools in the response. This is very verbose and should only be used when the user asks for it or when the user query cannot be answered without it (always first try without it)."),
    include_domains: z.array(z.string()).optional().describe("List of domains to specifically include in the search."),
    exclude_domains: z.array(z.string()).optional().describe("List of domains to exclude from the search."),
  });

// Type alias for the arguments
type ToolArgs = z.infer<typeof realtimeToolArgsSchema> | z.infer<typeof replToolArgsSchema>;

// Helper function to execute Groq chat completion
async function executeGroqQuery(args: ToolArgs) {
  // Initialize Groq client lazily
  const groq = new Groq();
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: args.question,
        },
      ],
      model: args.model,
      // Add include_domains and exclude_domains if they exist in args
      ...(args.include_domains && { include_domains: args.include_domains }),
      ...(args.exclude_domains && { exclude_domains: args.exclude_domains }),
    });

    const choice = chatCompletion.choices[0]?.message;
    const responseTextContent = choice?.content || "No response from model.";
    let finalResponseText = responseTextContent;

    // Check if verbose flag is true
    if ('mode' in args && args.mode === 'verbose') {
      // Use the logic to get executed_tools
      const executedTools = (choice as any)?.executed_tools ?? null;
      const responsePayload = {
          answer: responseTextContent,
          executed_tools: executedTools
      };
      finalResponseText = JSON.stringify(responsePayload, null, 2); // Pretty print JSON
    }

    return {
      content: [
        {
          type: "text" as const,
          text: finalResponseText, // Use the potentially modified response text
        },
      ],
    };
  } catch (error) {
    console.error("Error executing Groq query:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      content: [
        {
          type: "text" as const,
          text: `Failed to get response from Groq: ${errorMessage}`,
        },
      ],
    };
  }
}

// --- Radio BH Tool Handlers ---
async function handleSearchEpisodes(args: z.infer<typeof searchEpisodesArgsSchema>) {
  // If showId is provided, filter by show first to reduce search space
  let results: PodcastEpisode[];
  if (args.showId) {
    const showEpisodes = getEpisodesByShow(args.showId);
    results = searchEpisodesByKeyword(args.query).filter((ep: PodcastEpisode) => 
      showEpisodes.some(showEp => showEp.id === ep.id)
    );
  } else {
    results = searchEpisodesByKeyword(args.query);
  }
  
  const formattedResults = results.map((ep: PodcastEpisode) => {
    const show = getShowById(ep.showId);
    return `[${ep.id}] ${ep.title} (${show?.name || 'Unknown Show'})
Air Date: ${ep.airDate}
Topics: ${ep.topics.join(', ')}
Description: ${ep.description}
${ep.guests ? `Guests: ${ep.guests.join(', ')}` : ''}
---`;
  }).join('\n\n');
  
  return {
    content: [
      {
        type: "text" as const,
        text: results.length > 0 
          ? `Found ${results.length} episode(s):\n\n${formattedResults}`
          : `No episodes found matching "${args.query}"`,
      },
    ],
  };
}

async function handleGetShowInfo(args: z.infer<typeof getShowInfoArgsSchema>) {
  const show = getShowById(args.showId);
  
  if (!show) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Show with ID "${args.showId}" not found.`,
        },
      ],
    };
  }
  
  const category = getCategoryById(show.category);
  const showEpisodes = getEpisodesByShow(show.id);
  
  const info = `Show: ${show.name}
Description: ${show.description}
Category: ${category?.name || show.category}
Hosts: ${show.hosts.join(', ')}
Status: ${show.active ? 'Active' : 'Inactive'}
Started: ${show.startYear}
Schedule: ${show.schedule || 'N/A'}
Total Episodes Available: ${showEpisodes.length}`;
  
  return {
    content: [
      {
        type: "text" as const,
        text: info,
      },
    ],
  };
}

async function handleListShows(args: z.infer<typeof listShowsArgsSchema>) {
  let results = args.activeOnly ? getActiveShows() : shows;
  
  if (args.categoryId) {
    results = results.filter((show: PodcastShow) => show.category === args.categoryId);
  }
  
  const formattedResults = results.map((show: PodcastShow) => {
    const category = getCategoryById(show.category);
    return `[${show.id}] ${show.name}
Hosts: ${show.hosts.join(', ')}
Category: ${category?.name || show.category}
Schedule: ${show.schedule || 'N/A'}
${show.description}`;
  }).join('\n\n---\n\n');
  
  return {
    content: [
      {
        type: "text" as const,
        text: results.length > 0
          ? `Found ${results.length} show(s):\n\n${formattedResults}`
          : 'No shows found matching the criteria.',
      },
    ],
  };
}

async function handleGetEpisodeInfo(args: z.infer<typeof getEpisodeInfoArgsSchema>) {
  const episode = getEpisodeById(args.episodeId);
  
  if (!episode) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Episode with ID "${args.episodeId}" not found.`,
        },
      ],
    };
  }
  
  const show = getShowById(episode.showId);
  
  const info = `Episode: ${episode.title}
Show: ${show?.name || 'Unknown'}
Air Date: ${episode.airDate}
Duration: ${episode.duration || 'N/A'}
Topics: ${episode.topics.join(', ')}
${episode.guests ? `Guests: ${episode.guests.join(', ')}` : ''}

Description:
${episode.description}`;
  
  return {
    content: [
      {
        type: "text" as const,
        text: info,
      },
    ],
  };
}

async function handleSearchTopics(args: z.infer<typeof searchTopicsArgsSchema>) {
  const searchTerm = args.topic.toLowerCase();
  const matchingTopics = historicTopics.filter((topic: string) => 
    topic.toLowerCase().includes(searchTerm)
  );
  
  const matchingEpisodes = searchEpisodesByTopic(args.topic);
  
  let response = `Topics matching "${args.topic}":\n`;
  
  if (matchingTopics.length > 0) {
    response += `\nRelated Topics: ${matchingTopics.join(', ')}\n`;
  }
  
  if (matchingEpisodes.length > 0) {
    response += `\nFound ${matchingEpisodes.length} episode(s) covering this topic:\n\n`;
    response += matchingEpisodes.slice(0, 5).map((ep: PodcastEpisode) => {
      const show = getShowById(ep.showId);
      return `• [${ep.id}] ${ep.title} (${show?.name}) - ${ep.airDate}`;
    }).join('\n');
    
    if (matchingEpisodes.length > 5) {
      response += `\n... and ${matchingEpisodes.length - 5} more episodes`;
    }
  } else {
    response += `\nNo episodes found specifically covering this topic.`;
  }
  
  return {
    content: [
      {
        type: "text" as const,
        text: response,
      },
    ],
  };
}

async function handleAskCodingQuestion(args: z.infer<typeof askCodingQuestionArgsSchema>) {
  // Enhance the question with Radio BH context
  const groq = new Groq();
  
  const systemContext = `You are a coding assistant with deep knowledge of Radio BH's podcast content since 1997. 
Radio BH has extensively covered: ${historicTopics.slice(0, 20).join(', ')}, and many more topics.

Key areas of expertise from the shows:
- Laravel, PHP development (Code Masters, Web Wizards)
- TypeScript, JavaScript, React, Node.js (Web Wizards, Code Masters)
- Software architecture and best practices (Code Masters, Developer Life)
- AI and Machine Learning (AI Frontiers)
- Startup and business strategies (Startup Stories)

When answering, draw upon this rich knowledge base and provide practical, expert-level guidance.`;
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        {
          role: "user",
          content: args.question + (args.context ? `\n\nContext: ${args.context}` : ''),
        },
      ],
      model: args.model || "compound-beta",
    });

    const choice = chatCompletion.choices[0]?.message;
    const responseTextContent = choice?.content || "No response from model.";
    
    return {
      content: [
        {
          type: "text" as const,
          text: responseTextContent,
        },
      ],
    };
  } catch (error) {
    console.error("Error executing coding question:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      content: [
        {
          type: "text" as const,
          text: `Failed to get response: ${errorMessage}`,
        },
      ],
    };
  }
}

// --- Exportable Tool Definitions ---
export const searchEpisodesTool = {
  name: "search_radiobh_episodes",
  description: "Search Radio BH podcast episodes by keyword or topic. Searches across episode titles, descriptions, and topics from the extensive archive since 1997.",
  schema: searchEpisodesArgsSchema.shape,
  handler: handleSearchEpisodes,
};

export const getShowInfoTool = {
  name: "get_radiobh_show_info",
  description: "Get detailed information about a specific Radio BH podcast show, including hosts, category, schedule, and episode count.",
  schema: getShowInfoArgsSchema.shape,
  handler: handleGetShowInfo,
};

export const listShowsTool = {
  name: "list_radiobh_shows",
  description: "List all Radio BH podcast shows, optionally filtered by category. Returns show details including hosts, schedule, and descriptions.",
  schema: listShowsArgsSchema.shape,
  handler: handleListShows,
};

export const getEpisodeInfoTool = {
  name: "get_radiobh_episode_info",
  description: "Get detailed information about a specific Radio BH podcast episode, including air date, topics, guests, and full description.",
  schema: getEpisodeInfoArgsSchema.shape,
  handler: handleGetEpisodeInfo,
};

export const searchTopicsTool = {
  name: "search_radiobh_topics",
  description: "Search for topics covered in Radio BH's extensive archive since 1997. Returns matching topics and related episodes covering programming, technology, business, and more.",
  schema: searchTopicsArgsSchema.shape,
  handler: handleSearchTopics,
};

export const askCodingQuestionTool = {
  name: "ask_coding_question",
  description: "Ask coding questions with deep knowledge from Radio BH's expertise in Laravel, PHP, TypeScript, React, Node.js, and other technologies. Leverages insights from 25+ years of podcast content.",
  schema: askCodingQuestionArgsSchema.shape,
  handler: handleAskCodingQuestion,
};

// Original Groq tools (kept for backward compatibility)
export const realtimeTool = {
  name: "ask_with_realtime_information",
  description: "Ask a question requiring real-time information (e.g., news, current events) using a Groq model.",
  schema: realtimeToolArgsSchema.shape,
  handler: executeGroqQuery,
};

export const replTool = {
  name: "ask_with_code_execution",
  description: "Ask questions that benefit from Python REPL interaction (e.g., for intermediate calculations or code execution).",
  schema: replToolArgsSchema.shape,
  handler: executeGroqQuery,
};
// ----------------------------------

// Create MCP server instance
export const server = new McpServer({
  name: "radiobh-podcast-assistant",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register Radio BH tools
server.tool(searchEpisodesTool.name, searchEpisodesTool.description, searchEpisodesTool.schema, searchEpisodesTool.handler);
server.tool(getShowInfoTool.name, getShowInfoTool.description, getShowInfoTool.schema, getShowInfoTool.handler);
server.tool(listShowsTool.name, listShowsTool.description, listShowsTool.schema, listShowsTool.handler);
server.tool(getEpisodeInfoTool.name, getEpisodeInfoTool.description, getEpisodeInfoTool.schema, getEpisodeInfoTool.handler);
server.tool(searchTopicsTool.name, searchTopicsTool.description, searchTopicsTool.schema, searchTopicsTool.handler);
server.tool(askCodingQuestionTool.name, askCodingQuestionTool.description, askCodingQuestionTool.schema, askCodingQuestionTool.handler);

// Register original tools for backward compatibility
server.tool(realtimeTool.name, realtimeTool.description, realtimeTool.schema, realtimeTool.handler);
server.tool(replTool.name, replTool.description, replTool.schema, replTool.handler);
