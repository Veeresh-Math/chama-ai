import { describe, it, expect, beforeEach } from 'vitest';
import { MCPServer, parseMCPRequest } from '@/lib/mcp/protocol';
import { MCP_ERROR_CODES, type MCPRequest } from '@/types/mcp';
import { z } from 'zod';

describe('MCP Protocol', () => {
  let server: MCPServer;

  beforeEach(() => {
    server = new MCPServer();
  });

  describe('parseMCPRequest', () => {
    it('parses valid initialize request', () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 1,
        method: 'initialize',
        params: {},
      };
      const parsed = parseMCPRequest(request);
      expect(parsed.jsonrpc).toBe('2.0');
      expect(parsed.id).toBe(1);
      expect(parsed.method).toBe('initialize');
    });

    it('parses valid tools/list request', () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 2,
        method: 'tools/list',
      };
      const parsed = parseMCPRequest(request);
      expect(parsed.method).toBe('tools/list');
    });

    it('parses valid tools/call request', () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 3,
        method: 'tools/call',
        params: {
          name: 'test_tool',
          arguments: { foo: 'bar' },
        },
      };
      const parsed = parseMCPRequest(request);
      expect(parsed.method).toBe('tools/call');
      expect(parsed.params).toEqual({ name: 'test_tool', arguments: { foo: 'bar' } });
    });

    it('rejects invalid jsonrpc version', () => {
      const request = { jsonrpc: '1.0', id: 1, method: 'initialize' };
      expect(() => parseMCPRequest(request)).toThrow();
    });

    it('rejects missing method', () => {
      const request = { jsonrpc: '2.0', id: 1 };
      expect(() => parseMCPRequest(request)).toThrow();
    });

    it('rejects invalid id type', () => {
      const request = { jsonrpc: '2.0', id: {}, method: 'initialize' };
      expect(() => parseMCPRequest(request)).toThrow();
    });
  });

  describe('MCPServer', () => {
    it('handles initialize', async () => {
      const request = { jsonrpc: '2.0' as const, id: 1, method: 'initialize' };
      const response = await server.handleRequest(request);
      
      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(1);
      expect(response.result).toBeDefined();
      expect((response.result as any).protocolVersion).toBe('2024-11-05');
      expect((response.result as any).serverInfo.name).toBe('chama-ai');
      expect((response.result as any).capabilities.tools).toEqual({});
    });

    it('handles tools/list with no tools', async () => {
      const request = { jsonrpc: '2.0' as const, id: 2, method: 'tools/list' };
      const response = await server.handleRequest(request);
      
      expect(response.result).toBeDefined();
      expect((response.result as any).tools).toEqual([]);
    });

    it('handles tools/list with registered tools', async () => {
      const testTool = {
        name: 'test_tool',
        description: 'A test tool',
        inputSchema: {
          type: 'object' as const,
          properties: { foo: { type: 'string' } },
          required: ['foo'],
        },
      };
      
      server.registerTool(
        testTool,
        async () => ({ content: [{ type: 'text', text: 'ok' }] }),
        z.object({ foo: z.string() })
      );

      const request = { jsonrpc: '2.0' as const, id: 3, method: 'tools/list' };
      const response = await server.handleRequest(request);
      
      expect((response.result as any).tools).toHaveLength(1);
      expect((response.result as any).tools[0].name).toBe('test_tool');
    });

    it('handles tools/call for unknown tool', async () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 4,
        method: 'tools/call',
        params: { name: 'unknown_tool', arguments: {} },
      };
      const response = await server.handleRequest(request);
      
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(MCP_ERROR_CODES.METHOD_NOT_FOUND);
      expect(response.error?.message).toContain('unknown_tool');
    });

    it('handles tools/call with missing tool name', async () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 5,
        method: 'tools/call',
        params: { arguments: {} },
      };
      const response = await server.handleRequest(request);
      
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(MCP_ERROR_CODES.INVALID_PARAMS);
    });

    it('handles tools/call with invalid params', async () => {
      const testTool = {
        name: 'validated_tool',
        description: 'Tool with validation',
        inputSchema: {
          type: 'object' as const,
          properties: { required_field: { type: 'string' } },
          required: ['required_field'],
        },
      };
      
      server.registerTool(
        testTool,
        async () => ({ content: [{ type: 'text', text: 'ok' }] }),
        z.object({ required_field: z.string() })
      );

      const request = {
        jsonrpc: '2.0' as const,
        id: 6,
        method: 'tools/call',
        params: { name: 'validated_tool', arguments: { wrong_field: 'value' } },
      };
      const response = await server.handleRequest(request);
      
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(MCP_ERROR_CODES.INVALID_PARAMS);
    });

    it('handles tools/call successfully', async () => {
      const testTool = {
        name: 'success_tool',
        description: 'Tool that succeeds',
        inputSchema: {
          type: 'object' as const,
          properties: { value: { type: 'number' } },
        },
      };
      
      server.registerTool(
        testTool,
        async (params) => ({ 
          content: [{ type: 'text', text: `Result: ${params.value}` }] 
        }),
        z.object({ value: z.number() })
      );

      const request = {
        jsonrpc: '2.0' as const,
        id: 7,
        method: 'tools/call',
        params: { name: 'success_tool', arguments: { value: 42 } },
      };
      const response = await server.handleRequest(request);
      
      expect(response.result).toBeDefined();
      expect((response.result as any).content[0].text).toBe('Result: 42');
      expect((response.result as any).isError).toBeUndefined();
    });

    it('handles tool handler errors', async () => {
      const errorTool = {
        name: 'error_tool',
        description: 'Tool that throws',
        inputSchema: { type: 'object' as const, properties: {} },
      };
      
      server.registerTool(
        errorTool,
        async () => { throw new Error('Handler failed'); },
        z.object({})
      );

      const request = {
        jsonrpc: '2.0' as const,
        id: 8,
        method: 'tools/call',
        params: { name: 'error_tool', arguments: {} },
      };
      const response = await server.handleRequest(request);
      
      expect(response.result).toBeDefined();
      expect((response.result as any).isError).toBe(true);
      expect((response.result as any).content[0].text).toBe('Handler failed');
    });

    it('handles unknown method', async () => {
      const request = { jsonrpc: '2.0' as const, id: 9, method: 'unknown/method' };
      const response = await server.handleRequest(request);
      
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(MCP_ERROR_CODES.METHOD_NOT_FOUND);
    });

    it('handles invalid jsonrpc version', async () => {
      const request = { jsonrpc: '1.0', id: 10, method: 'initialize' };
      const response = await server.handleRequest(request as unknown as MCPRequest);
      
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(MCP_ERROR_CODES.INVALID_REQUEST);
    });
  });
});