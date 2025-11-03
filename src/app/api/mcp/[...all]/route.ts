import { createMcpHandler } from '@vercel/mcp-adapter';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { 
  searchEpisodesTool,
  getShowInfoTool,
  listShowsTool,
  getEpisodeInfoTool,
  searchTopicsTool,
  askCodingQuestionTool,
  realtimeTool,
  replTool
} from '@/server';

const handler = createMcpHandler((adapterServer: McpServer) => {
    // Register Radio BH tools
    adapterServer.tool(searchEpisodesTool.name, searchEpisodesTool.description, searchEpisodesTool.schema, searchEpisodesTool.handler);
    adapterServer.tool(getShowInfoTool.name, getShowInfoTool.description, getShowInfoTool.schema, getShowInfoTool.handler);
    adapterServer.tool(listShowsTool.name, listShowsTool.description, listShowsTool.schema, listShowsTool.handler);
    adapterServer.tool(getEpisodeInfoTool.name, getEpisodeInfoTool.description, getEpisodeInfoTool.schema, getEpisodeInfoTool.handler);
    adapterServer.tool(searchTopicsTool.name, searchTopicsTool.description, searchTopicsTool.schema, searchTopicsTool.handler);
    adapterServer.tool(askCodingQuestionTool.name, askCodingQuestionTool.description, askCodingQuestionTool.schema, askCodingQuestionTool.handler);
    
    // Register original Groq tools for backward compatibility
    adapterServer.tool(realtimeTool.name, realtimeTool.description, realtimeTool.schema, realtimeTool.handler);
    adapterServer.tool(replTool.name, replTool.description, replTool.schema, replTool.handler);
  }, undefined, {
    // AdapterConfig
    redisUrl: process.env.REDIS_URL,
    basePath: '/api/mcp', // This means your MCP endpoints will be /api/mcp/sse, /api/mcp/mcp, etc.
    verboseLogs: process.env.NODE_ENV === 'development', // Enable verbose logs in development
    maxDuration: 180, // Vercel Pro/Enterprise can go up to 300-900s for functions with Fluid enabled
  }
);

export { handler as GET, handler as POST, handler as OPTIONS }; // Add OPTIONS for CORS preflight if needed by clients