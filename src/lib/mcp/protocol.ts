import { z } from 'zod';
import {
  MCPRequest,
  MCPResponse,
  MCPError,
  Tool,
  CallToolResult,
  InitializeResult,
  ListToolsResult,
  MCP_ERROR_CODES,
  createMCPError,
  createMCPResponse,
} from '@/types/mcp';

export {
  MCP_ERROR_CODES,
  createMCPError,
  createMCPResponse,
  type MCPRequest,
  type MCPResponse,
  type MCPError,
  type Tool,
  type CallToolResult,
  type InitializeResult,
  type ListToolsResult,
};

export interface RegisteredTool {
  definition: Tool;
  handler: (params: Record<string, unknown>) => Promise<CallToolResult>;
  inputSchema: z.ZodSchema;
}

export class MCPServer {
  private tools = new Map<string, RegisteredTool>();

  registerTool(definition: Tool, handler: (params: Record<string, unknown>) => Promise<CallToolResult>, inputSchema: z.ZodSchema): void {
    this.tools.set(definition.name, { definition, handler, inputSchema });
  }

  getTool(name: string): RegisteredTool | undefined {
    return this.tools.get(name);
  }

  listTools(): Tool[] {
    return Array.from(this.tools.values()).map(t => t.definition);
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (request.jsonrpc !== '2.0') {
      return createMCPResponse(
        request.id,
        undefined,
        createMCPError(MCP_ERROR_CODES.INVALID_REQUEST, 'Invalid JSON-RPC version')
      );
    }

    try {
      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request);
        case 'tools/list':
          return this.handleToolsList(request);
        case 'tools/call':
          return await this.handleToolsCall(request);
        default:
          return createMCPResponse(
            request.id,
            undefined,
            createMCPError(MCP_ERROR_CODES.METHOD_NOT_FOUND, `Method not found: ${request.method}`)
          );
      }
    } catch (error) {
      console.error('[MCP] Handler error:', error);
      return createMCPResponse(
        request.id,
        undefined,
        createMCPError(MCP_ERROR_CODES.INTERNAL_ERROR, 'Internal server error')
      );
    }
  }

  private handleInitialize(request: MCPRequest): MCPResponse {
    const result: InitializeResult = {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: 'chama-ai',
        version: '1.0.0',
      },
    };
    return createMCPResponse(request.id, result);
  }

  private handleToolsList(request: MCPRequest): MCPResponse {
    const result: ListToolsResult = {
      tools: this.listTools(),
    };
    return createMCPResponse(request.id, result);
  }

  private async handleToolsCall(request: MCPRequest): Promise<MCPResponse> {
    const params = request.params as Record<string, unknown> | undefined;
    
    if (!params || typeof params.name !== 'string') {
      return createMCPResponse(
        request.id,
        undefined,
        createMCPError(MCP_ERROR_CODES.INVALID_PARAMS, 'Missing or invalid tool name')
      );
    }

    const tool = this.getTool(params.name);
    if (!tool) {
      return createMCPResponse(
        request.id,
        undefined,
        createMCPError(MCP_ERROR_CODES.METHOD_NOT_FOUND, `Tool not found: ${params.name}`)
      );
    }

    const validationResult = tool.inputSchema.safeParse(params.arguments);
    if (!validationResult.success) {
      return createMCPResponse(
        request.id,
        undefined,
        createMCPError(MCP_ERROR_CODES.INVALID_PARAMS, 'Invalid parameters', validationResult.error.flatten())
      );
    }

    try {
      const result = await tool.handler(validationResult.data);
      return createMCPResponse(request.id, result);
    } catch (error) {
      console.error(`[MCP] Tool ${params.name} error:`, error);
      return createMCPResponse(
        request.id,
        { content: [{ type: 'text', text: error instanceof Error ? error.message : 'Tool execution failed' }], isError: true },
        undefined
      );
    }
  }
}

export function parseMCPRequest(body: unknown): MCPRequest {
  const requestSchema = z.object({
    jsonrpc: z.literal('2.0'),
    id: z.union([z.string(), z.number(), z.null()]),
    method: z.string(),
    params: z.record(z.unknown()).optional(),
  });

  const result = requestSchema.safeParse(body);
  if (!result.success) {
    throw createMCPError(MCP_ERROR_CODES.PARSE_ERROR, 'Invalid request format', result.error.flatten());
  }
  return result.data;
}