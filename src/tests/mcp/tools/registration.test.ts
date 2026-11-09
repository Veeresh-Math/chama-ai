import { describe, it, expect } from 'vitest';
import { createMCPServer } from '@/lib/mcp/server';

const EXPECTED_TOOLS = [
  'create_chama',
  'join_chama',
  'contribute',
  'distribute_funds',
  'get_community_state',
  'analyze_trust',
  'create_gig_job',
  'complete_milestone',
  'distribute_yield',
];

describe('MCP Tool Registration', () => {
  it('registers all 9 tools', () => {
    const server = createMCPServer();
    const tools = server.listTools();
    expect(tools).toHaveLength(9);
    expect(tools.map(t => t.name)).toEqual(EXPECTED_TOOLS);
  });

  it('every tool has a valid MCP schema', () => {
    const server = createMCPServer();
    for (const tool of server.listTools()) {
      expect(tool.inputSchema.type).toBe('object');
      expect(Object.keys(tool.inputSchema.properties ?? {})).not.toHaveLength(0);
    }
  });

  it.each(EXPECTED_TOOLS)('%s is registered and validates params with -32602', async (toolName) => {
    const server = createMCPServer();
    // Empty args must reach Zod validation → INVALID_PARAMS (-32602),
    // proving the tool exists (-32601 would mean unregistered) and Zod validation is wired.
    const response = await server.handleRequest({
      jsonrpc: '2.0' as const,
      id: 1,
      method: 'tools/call',
      params: { name: toolName, arguments: {} },
    });
    expect(response.error?.code).not.toBe(-32601); // registered
    expect(response.error?.code).toBe(-32602); // Zod validation engaged
  });

  it('tools/list returns identical tool set on repeated calls', () => {
    const server = createMCPServer();
    const first = server.listTools().map(t => t.name);
    const second = server.listTools().map(t => t.name);
    expect(first).toEqual(second);
  });
});
