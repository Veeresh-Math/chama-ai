// Tool registration - imports all tool modules and registers them
// Validation uses the Zod schemas (single source of truth) while tool
// definitions carry the JSON-schema form served over the wire via tools/list.
import { z } from 'zod';
import { MCPServer } from '../protocol';
import type { CallToolResult } from '@/types/mcp';
import { communityTools, communityToolSchemas } from './community';
import { gigTools, gigToolSchemas } from './gig';
import { yieldTools, yieldToolSchemas } from './yield';

type ToolHandler = (params: Record<string, unknown>) => Promise<CallToolResult>;

export function registerAllTools(server: MCPServer): void {
  const registered = [
    ...communityTools.map(tool => ({
      tool,
      zodSchema: communityToolSchemas[tool.name as keyof typeof communityToolSchemas],
    })),
    ...gigTools.map(tool => ({
      tool,
      zodSchema: gigToolSchemas[tool.name as keyof typeof gigToolSchemas],
    })),
    ...yieldTools.map(tool => ({
      tool,
      zodSchema: yieldToolSchemas[tool.name as keyof typeof yieldToolSchemas],
    })),
  ];

  for (const { tool, zodSchema } of registered) {
    server.registerTool(
      tool,
      tool.handler as unknown as ToolHandler,
      zodSchema as unknown as z.ZodSchema
    );
  }
}
