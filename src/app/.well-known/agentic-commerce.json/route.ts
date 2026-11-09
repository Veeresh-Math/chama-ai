import { NextResponse } from 'next/server';
import { createMCPServer } from '@/lib/mcp/server';
import { buildACPManifest } from '@/lib/mcp/discovery';

export async function GET() {
  const server = createMCPServer();
  const manifest = buildACPManifest(server.listTools());

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
