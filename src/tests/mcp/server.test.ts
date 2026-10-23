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

  it('server has community tools registered by default', () => {
    const server = createMCPServer();
    expect(server.listTools()).toHaveLength(6);
  });
});