import { NextResponse } from 'next/server';
import { createMCPServer } from '@/lib/mcp/server';
import { buildLlmsTxt } from '@/lib/mcp/discovery';

export async function GET() {
  const server = createMCPServer();
  const llmsTxt = buildLlmsTxt(server.listTools());

  return new NextResponse(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
