export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: readonly string[];
  };
}

export interface CallToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface InitializeResult {
  protocolVersion: string;
  capabilities: {
    tools: Record<string, unknown>;
  };
  serverInfo: {
    name: string;
    version: string;
  };
}

export interface ListToolsResult {
  tools: Tool[];
}

export const MCP_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

export function createMCPError(code: number, message: string, data?: unknown): MCPError {
  return { code, message, data };
}

export function createMCPResponse(
  id: string | number | null,
  result?: unknown,
  error?: MCPError
): MCPResponse {
  return {
    jsonrpc: '2.0',
    id,
    ...(result !== undefined && { result }),
    ...(error !== undefined && { error }),
  };
}