import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/mcp/sse/route';
import {
  getSSESession,
  listSSESessions,
  unregisterSSESession,
  openSSESession,
  releaseSSESessionSlot,
  SESSION_CAPS,
} from '@/lib/mcp/sse';

function createRouteTestSession(id: string) {
  const sentEvents: Array<{ event: string; data: unknown }> = [];
  return {
    id,
    send: (event: string, data: unknown) => {
      sentEvents.push({ event, data });
    },
    close: () => {},
    createdAt: Date.now(),
    lastPingAt: Date.now(),
  };
}

function makeRequest(url: string): Request {
  return new Request(url) as unknown as Request;
}

describe('MCP SSE Endpoint', () => {
  beforeEach(() => {
    for (const id of listSSESessions()) {
      unregisterSSESession(id);
    }
  });

  afterEach(() => {
    for (const id of listSSESessions()) {
      unregisterSSESession(id);
    }
  });

  it('rejects missing session_id with 400', async () => {
    const req = makeRequest('http://localhost:3000/api/mcp/sse');
    const res = await GET(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('session_id');
  });

  it('rejects invalid session_id format with 400', async () => {
    const req = makeRequest('http://localhost:3000/api/mcp/sse?session_id=bad');
    const res = await GET(req as never);
    expect(res.status).toBe(400);
  });

  it('rejects invalid api_key param with 401', async () => {
    const req = makeRequest('http://localhost:3000/api/mcp/sse?session_id=auth-tests123&api_key=not-a-real-key');
    const res = await GET(req as never);
    expect(res.status).toBe(401);
  });

  it('rejects over-cap connections with 429', async () => {
    // Exhaust the per-IP cap directly against the same IP the route resolves
    // (plain Request has no forwarded-for headers, so route resolves ip='unknown')
    for (let i = 0; i < SESSION_CAPS.sessionsPerIp; i++) {
      const id = `route-cap-${String(i).padStart(4, '0')}`;
      expect(openSSESession(createRouteTestSession(id), 'unknown')).toBe(true);
    }
    const req = makeRequest('http://localhost:3000/api/mcp/sse?session_id=route-cap-over');
    const res = await GET(req as never);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toContain('Too many');

    for (let i = 0; i < SESSION_CAPS.sessionsPerIp; i++) {
      releaseSSESessionSlot(`route-cap-${String(i).padStart(4, '0')}`);
    }
  });

  it('returns SSE stream with correct headers', async () => {
    const req = makeRequest(`http://localhost:3000/api/mcp/sse?session_id=abc-12345`);
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/event-stream');
    expect(res.headers.get('cache-control')).toContain('no-cache');
    await readerCancelAndCleanup(res);
  });

  it('streams endpoint + connected events and registers the session', async () => {
    const sessionId = 'sse-route-123';
    const req = makeRequest(`http://localhost:3000/api/mcp/sse?session_id=${sessionId}`);
    const res = await GET(req as never);

    expect(getSSESession(sessionId)).toBeDefined();

    const reader = res.body!.getReader()!;
    const first = await reader.read();
    const text = new TextDecoder().decode(first.value!);
    expect(text).toContain('event: endpoint');
    expect(text).toContain('"session_id":"sse-route-123"');
    expect(text).toContain('/api/mcp');

    const second = await reader.read();
    const secondText = new TextDecoder().decode(second.value!);
    expect(secondText).toContain('event: connected');
    expect(secondText).toContain('"protocol_version":"2024-11-05"');

    await reader.cancel();
    await waitFor(() => expect(getSSESession(sessionId)).toBeUndefined());
  });

  it('unregisters the session when client disconnects (cancel)', async () => {
    const sessionId = 'disconnect-123';
    const req = makeRequest(`http://localhost:3000/api/mcp/sse?session_id=${sessionId}`);
    const res = await GET(req as never);
    expect(getSSESession(sessionId)).toBeDefined();

    const reader = res.body!.getReader()!;
    await reader.read(); // endpoint event
    await reader.cancel();

    await waitFor(() => expect(getSSESession(sessionId)).toBeUndefined());
  });
});

// Helpers

async function waitFor(assertion: () => void, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  let lastError: unknown;
  while (Date.now() - start < timeoutMs) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  }
  throw lastError;
}

async function readerCancelAndCleanup(res: Response) {
  const reader = res.body!.getReader()!;
  await reader.cancel();
}
