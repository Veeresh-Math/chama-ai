// Tool registration - imports all tool modules and registers them
import { MCPServer } from '../protocol';
import type { CallToolResult } from '@/types/mcp';
import { communityTools } from './community';

type ToolHandler = (params: Record<string, unknown>) => Promise<CallToolResult>;

export function registerAllTools(server: MCPServer): void {
  for (const tool of communityTools) {
    server.registerTool(
      tool,
      tool.handler as unknown as ToolHandler,
      tool.inputSchema as any // Zod schema
    );
  }
}