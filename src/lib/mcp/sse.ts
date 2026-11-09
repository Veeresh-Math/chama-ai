// ============================================
// SSE Session Management for MCP Streaming
//============================================

export interface SSESession {
  id: string;
  send: (event: string, data: unknown) => void;
  close: () => void;
  createdAt: number;
  lastPingAt: number;
}

export interface ProgressPayload {
  step: string;
  message: string;
  progress?: number; // 0-100
  data?: unknown;
  timestamp: number;
}

const sessions = new Map<string, SSESession>();
const sessionsPerIp = new Map<string, number>();
const sessionIps = new Map<string, string>(); // sessionId -> ip (for cap bookkeeping)

export const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;
export const PING_INTERVAL_MS = 30_000;
export const MAX_SESSION_AGE_MS = 5 * 60_000;
export const SESSION_CAPS = {
  totalSessions: 100,
  sessionsPerIp: 10,
} as const;

export function isValidSessionId(id: string | null): id is string {
  return typeof id === 'string' && SESSION_ID_PATTERN.test(id);
}

export function formatSSEEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export function registerSSESession(session: SSESession): () => void {
  sessions.set(session.id, session);
  return () => unregisterSSESession(session.id);
}

// --- Connection hardening: caps + duplicate-id hijack protection ---

export function canOpenSSESession(id: string, ip: string): boolean {
  // Reject duplicate session ids — only the original holder keeps its stream
  if (sessions.has(id)) {
    return false;
  }
  if (sessions.size >= SESSION_CAPS.totalSessions) {
    return false;
  }
  const used = sessionsPerIp.get(ip) ?? 0;
  if (used >= SESSION_CAPS.sessionsPerIp) {
    return false;
  }
  return true;
}

export function openSSESession(session: SSESession, ip: string): boolean {
  if (!canOpenSSESession(session.id, ip)) {
    return false;
  }
  registerSSESession(session);
  sessionIps.set(session.id, ip);
  sessionsPerIp.set(ip, (sessionsPerIp.get(ip) ?? 0) + 1);
  return true;
}

export function releaseSSESessionSlot(id: string): void {
  const ip = sessionIps.get(id);
  sessionIps.delete(id);
  if (ip) {
    const used = sessionsPerIp.get(ip) ?? 1;
    if (used <= 1) {
      sessionsPerIp.delete(ip);
    } else {
      sessionsPerIp.set(ip, used - 1);
    }
  }
  sessions.delete(id);
}

export function getSSESession(id: string): SSESession | undefined {
  return sessions.get(id);
}

export function unregisterSSESession(id: string): void {
  sessions.delete(id);
}

export function listSSESessions(): string[] {
  return Array.from(sessions.keys());
}

export function sendSSEEvent(id: string, event: string, data: unknown): boolean {
  const session = sessions.get(id);
  if (!session) {
    return false;
  }
  try {
    session.send(event, data);
    return true;
  } catch (error) {
    console.error(`[MCP SSE] Failed to send event to session ${id}:`, error);
    return false;
  }
}

export function sendMCPProgress(
  id: string | undefined,
  step: string,
  message: string,
  options?: { progress?: number; data?: unknown }
): boolean {
  if (!id) {
    return false;
  }
  const payload: ProgressPayload = {
    step,
    message,
    ...(options?.progress !== undefined && { progress: options.progress }),
    ...(options?.data !== undefined && { data: options.data }),
    timestamp: Date.now(),
  };
  return sendSSEEvent(id, 'progress', payload);
}

export function cleanupStaleSessions(maxAgeMs: number = MAX_SESSION_AGE_MS): number {
  const now = Date.now();
  let cleaned = 0;
  const entries = Array.from(sessions.entries());
  for (const [id, session] of entries) {
    if (now - session.createdAt > maxAgeMs) {
      try {
        session.close();
      } catch {
        // ignore close errors on stale sessions
      }
      releaseSSESessionSlot(id);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[MCP SSE] Cleaned up ${cleaned} stale session(s)`);
  }
  return cleaned;
}
