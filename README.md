# Radio BH Podcast Assistant - MCP Server

A Model Context Protocol (MCP) server that provides deep knowledge of Radio BH's podcast shows and episodes, including all information and topics discussed since 1997. This assistant is expert in coding topics including Laravel, PHP, TypeScript, React, Node.js, and many more technologies covered in our extensive podcast archive.

## Features

### Radio BH-Specific Tools

*   **`search_radiobh_episodes`** - Search through podcast episodes by keyword or topic
*   **`get_radiobh_show_info`** - Get detailed information about specific shows
*   **`list_radiobh_shows`** - Browse all Radio BH shows, filterable by category
*   **`get_radiobh_episode_info`** - Get detailed episode information
*   **`search_radiobh_topics`** - Search for topics in the historic archive since 1997
*   **`ask_coding_question`** - Ask coding questions with deep knowledge from Radio BH's expertise

### General AI Tools (via Groq)

*   **`ask_with_realtime_information`** - Ask questions requiring real-time information
*   **`ask_with_code_execution`** - Ask questions with Python REPL execution

## Radio BH Shows

Our podcast network covers:

- **Code Masters** - Deep dive into software development (since 1997)
- **Tech Talk Radio** - Latest technology trends and innovations (since 1998)
- **Web Wizards** - Frontend, backend, and full-stack web development (since 2012)
- **Developer Life** - Career growth and work-life balance for developers (since 2010)
- **AI Frontiers** - Artificial intelligence and machine learning (since 2016)
- **Startup Stories** - Entrepreneurship and business strategy (since 2005)
- **Culture Bytes** - Technology and culture intersection (since 2008)
- **Learn Hub** - Educational technology and learning (since 2015)

## Topics Covered

25+ years of content on: Laravel, PHP, TypeScript, JavaScript, React, Vue.js, Angular, Node.js, Python, Java, C++, Go, Rust, Docker, Kubernetes, AWS, Azure, Machine Learning, AI, Design Patterns, Agile, Microservices, and much more!

## Prerequisites

*   Node.js >= 18.0.0
*   A Groq API key set in the `GROQ_API_KEY` environment variable (required for AI-powered coding questions and real-time tools)

## Installation

```bash
npm install mcp-radiobh-server
```

## Usage

This server follows the standard MCP server pattern using stdio for transport. It's designed to be run by an MCP client (like Claude Desktop or a custom client).

Refer to the official [MCP Quickstart for Server Developers](https://modelcontextprotocol.io/quickstart/server) for instructions on setting up and connecting MCP servers.

When configuring your client, use the command `npx mcp-radiobh-server` or `mcp-radiobh-server` (if installed globally) to run this server.

Here's an example of how you might configure an MCP client (e.g., in a `settings.json` file) to launch this server:

```json
{
  "mcpServers": {
    "radio-bh": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-radiobh-server"
      ],
      "env": {
        "GROQ_API_KEY": "YOUR_GROQ_API_KEY_HERE"
      }
    }
  }
}
```

## Example Queries

- "Search for episodes about Laravel framework"
- "Show me all active shows about technology"
- "What topics has Radio BH covered about React?"
- "Get information about the Code Masters show"
- "Ask a coding question: How do I optimize TypeScript performance?"
- "What episodes discussed Node.js best practices?"

## Hosting on Vercel

This server can also be deployed to Vercel for web-based access.

1.  **Prerequisites**:
    *   Ensure you have a Vercel account.
    *   Connect your Git repository to Vercel.

2.  **Environment Variables**:
    Set the following environment variables in your Vercel project settings:
    *   `GROQ_API_KEY`: Your Groq API key (required for AI-powered features).
    *   `REDIS_URL`: (Recommended for SSE transport) The connection URL for a Redis instance (e.g., from Vercel KV or Upstash).

3.  **Build Configuration**:
    Vercel should automatically detect it as a Next.js application. The build command `npm run build:vercel` (or `yarn build:vercel`/`pnpm build:vercel`) and the output directory (`.next`) will be used.

4.  **Accessing the MCP Server**:
    Once deployed, your MCP server endpoints will be available at `https://your-deployment-url.vercel.app/api/mcp`.
    For example, the SSE endpoint would be `https://your-deployment-url.vercel.app/api/mcp/sse`.

## Development with Vercel CLI

To run the Vercel deployment locally:

1.  Install Vercel CLI: `npm install -g vercel`
2.  Set up environment variables locally (e.g., in a `.env.local` file at the project root):
    ```
    GROQ_API_KEY=your_groq_api_key
    REDIS_URL=your_redis_url
    ```
3.  Run the development server: `vercel dev` or `npm run dev:vercel`.

## About Radio BH

Radio BH has been broadcasting quality podcast content since 1997, covering technology, business, culture, and education. Our shows feature industry experts, thought leaders, and passionate hosts who bring deep insights into programming, software development, and the tech industry.

## License

[MIT](LICENSE) 
