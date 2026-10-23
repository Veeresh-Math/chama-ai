import { NextRequest, NextResponse } from 'next/server';
import { createMCPServer } from '@/lib/mcp/server';
import { parseMCPRequest, MCP_ERROR_CODES, createMCPError, createMCPResponse } from '@/lib/mcp/protocol';
import { validateAPIKey, rateLimit, getAuthHeaders, getRateLimitHeaders } from '@/lib/mcp/auth';

const mcpServer = createMCPServer();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const apiKey = request.headers.get('x-api-key');

  // Authentication
  const auth = validateAPIKey(apiKey || '');
  if (!auth.valid) {
    return NextResponse.json(
      createMCPResponse(null, undefined, createMCPError(MCP_ERROR_CODES.INVALID_REQUEST, 'Invalid or missing API key')),
      { status: 401, headers: getAuthHeaders(apiKey || '') }
    );
  }

  // Rate limiting
  const rateLimitResult = rateLimit(apiKey!);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.allowed, rateLimitResult.retryAfter);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      createMCPResponse(null, undefined, createMCPError(MCP_ERROR_CODES.INTERNAL_ERROR, 'Rate limit exceeded')),
      { status: 429, headers: { ...rateLimitHeaders, 'Retry-After': String(rateLimitResult.retryAfter || 60) } }
    );
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      createMCPResponse(null, undefined, createMCPError(MCP_ERROR_CODES.PARSE_ERROR, 'Invalid JSON')),
      { status: 400, headers: rateLimitHeaders }
    );
  }

  // Parse and validate MCP request
  let mcpRequest;
  try {
    mcpRequest = parseMCPRequest(body);
  } catch (error) {
    const mcpError = error as { code: number; message: string; data?: unknown };
    return NextResponse.json(
      createMCPResponse(null, undefined, createMCPError(mcpError.code, mcpError.message, mcpError.data)),
      { status: 400, headers: rateLimitHeaders }
    );
  }

  // Handle MCP request
  const response = await mcpServer.handleRequest(mcpRequest);

  // Log request
  const duration = Date.now() - startTime;
  console.log(`[MCP] ${mcpRequest.method} ${mcpRequest.id} - ${duration}ms - ${response.error ? 'error' : 'ok'}`);

  return NextResponse.json(response, { headers: rateLimitHeaders });
}