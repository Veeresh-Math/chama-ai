import { describe, it, expect } from 'vitest';
import { createMCPServer } from '@/lib/mcp/server';

describe('MCP Server Factory', () => {
  it('creates server instance', () => {
    const server = createMCPServer();
    expect(server).toBeDefined();
    expect(typeof server.handleRequest).toBe('function');
    expect(typeof server.registerTool).toBe('function');
    expect(typeof server.listTools).toBe('function');
  });

  it('server has all 8 tools registered by default (6 community + 2 gig)', () => {
    const server = createMCPServer();
    const toolNames = server.listTools().map(t => t.name);
    expect(toolNames).toHaveLength(8);
    expect(toolNames).toContain('create_chama');
    expect(toolNames).toContain('join_chama');
    expect(toolNames).toContain('contribute');
    expect(toolNames).toContain('distribute_funds');
    expect(toolNames).toContain('get_community_state');
    expect(toolNames).toContain('analyze_trust');
    expect(toolNames).toContain('create_gig_job');
    expect(toolNames).toContain('complete_milestone');
  });
});