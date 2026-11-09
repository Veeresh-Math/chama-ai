import { NextRequest, NextResponse } from 'next/server';
import {
  isValidSessionId,
  formatSSEEvent,
  canOpenSSESession,
  openSSESession,
  releaseSSESessionSlot,
  cleanupStaleSessions,
  PING_INTERVAL_MS,
} from '@/lib/mcp/sse';
import { validateAPIKey } from '@/lib/mcp/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!isValidSessionId(sessionId)) {
    return NextResponse.json(
      {
        error: 'Invalid or missing session_id (must be 8-64 chars of [a-zA-Z0-9_-])',
      },
      { status: 400 }
    );
  }

  // Optional API key: if provided it must be valid. Omitting it is allowed
  // because a session is a read-only progress stream bound to its own id.
  const apiKey = url.searchParams.get('api_key') || request.headers.get('x-api-key');
  if (apiKey && !validateAPIKey(apiKey).valid) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401, headers: { 'WWW-Authenticate': 'Bearer error="invalid_token"' } }
    );
  }

  // Reclaim stale sessions, then enforce hard caps (total + per-IP) to
  // protect against connection-exhaustion DoS.
  cleanupStaleSessions();
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  if (!canOpenSSESession(sessionId, ip)) {
    console.warn(`[MCP SSE] Rejected session ${sessionId} (capacity or duplicate id) ip=${ip}`);
    return NextResponse.json(
      { error: 'Too many concurrent SSE sessions' },
      { status: 429, headers: { 'Retry-After': '30' } }
    );
  }

  const encoder = new TextEncoder();
  let pingInterval: ReturnType<typeof setInterval> | undefined;
  let registered = false;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(formatSSEEvent(event, data)));
      };

      const close = () => {
        if (closed) return;
        closed = true;
        if (pingInterval) clearInterval(pingInterval);
        if (registered) {
          registered = false;
          releaseSSESessionSlot(sessionId);
        }
        try {
          controller.close();
        } catch {
          // controller may already be closed
        }
      };

      const openedNow = openSSESession(
        {
          id: sessionId,
          send,
          close,
          createdAt: Date.now(),
          lastPingAt: Date.now(),
        },
        ip
      );

      if (!openedNow) {
        // Lost a race with a concurrent connection — drop politely
        if (pingInterval) clearInterval(pingInterval);
        try {
          controller.close();
        } catch {
          // already closed
        }
        return;
      }
      registered = true;

      // MCP SSE transport: first events tell the client where to POST messages
      const origin = url.origin;
      send('endpoint', { url: `${origin}/api/mcp`, session_id: sessionId });
      send('connected', { session_id: sessionId, protocol_version: '2024-11-05' });

      // Keep-alive ping every 30s
      pingInterval = setInterval(() => {
        try {
          send('ping', { timestamp: Date.now() });
        } catch {
          close();
        }
      }, PING_INTERVAL_MS);

      // Cleanup on client disconnect
      request.signal.addEventListener('abort', close);
    },
    cancel() {
      if (closed) {
        return;
      }
      closed = true;
      if (pingInterval) clearInterval(pingInterval);
      if (registered) {
        registered = false;
        releaseSSESessionSlot(sessionId);
      }
    },
  });

  console.log(`[MCP SSE] Session connected: ${sessionId} ip=${ip}`);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
