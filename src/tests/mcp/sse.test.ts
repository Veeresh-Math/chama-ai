import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  formatSSEEvent,
  isValidSessionId,
  registerSSESession,
  getSSESession,
  unregisterSSESession,
  sendSSEEvent,
  sendMCPProgress,
  listSSESessions,
  cleanupStaleSessions,
  canOpenSSESession,
  openSSESession,
  releaseSSESessionSlot,
  SESSION_CAPS,
  SESSION_ID_PATTERN,
} from '@/lib/mcp/sse';

function createTestSession(id: string) {
  const sentEvents: Array<{ event: string; data: unknown }> = [];
  const session = {
    id,
    send: (event: string, data: unknown) => {
      sentEvents.push({ event, data });
    },
    close: () => {},
    createdAt: Date.now(),
    lastPingAt: Date.now(),
  };
  return { session, sentEvents };
}

describe('SSE Session Management', () => {
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

  describe('isValidSessionId', () => {
    it('accepts valid session ids', () => {
      expect(isValidSessionId('abcdef12')).toBe(true);
      expect(isValidSessionId('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidSessionId('sess_ABC-123_def')).toBe(true);
    });

    it('rejects invalid session ids', () => {
      expect(isValidSessionId(null)).toBe(false);
      expect(isValidSessionId('')).toBe(false);
      expect(isValidSessionId('short')).toBe(false);
      expect(isValidSessionId('has spaces')).toBe(false);
      expect(isValidSessionId('bad!chars')).toBe(false);
      expect(isValidSessionId('a'.repeat(65))).toBe(false);
    });

    it('accepts exactly 8-64 chars', () => {
      expect(SESSION_ID_PATTERN.test('a'.repeat(8))).toBe(true);
      expect(SESSION_ID_PATTERN.test('a'.repeat(64))).toBe(true);
      expect(SESSION_ID_PATTERN.test('a'.repeat(7))).toBe(false);
      expect(SESSION_ID_PATTERN.test('a'.repeat(65))).toBe(false);
    });
  });

  describe('formatSSEEvent', () => {
    it('formats valid SSE output', () => {
      const output = formatSSEEvent('progress', { step: 'a', message: 'b' });
      expect(output.startsWith('event: progress\n')).toBe(true);
      expect(output.endsWith('\n\n')).toBe(true);
      const dataLine = output.split('\n')[1];
      expect(dataLine!.startsWith('data: ')).toBe(true);
      const parsed = JSON.parse(dataLine!.replace('data: ', ''));
      expect(parsed).toEqual({ step: 'a', message: 'b' });
    });

    it('JSON-encodes complex data safely', () => {
      const data = { nested: { arr: [1, 2, 3] }, text: 'quotes " and \n newline' };
      const output = formatSSEEvent('event', data);
      const parsed = JSON.parse(output.split('\n')[1]!.replace('data: ', ''));
      expect(parsed).toEqual(data);
    });
  });

  describe('session registry', () => {
    it('registers and retrieves a session', () => {
      const { session } = createTestSession('sse-session-1');
      const unregister = registerSSESession(session);
      expect(typeof unregister).toBe('function');
      expect(getSSESession('sse-session-1')).toBe(session);
      expect(listSSESessions()).toContain('sse-session-1');
      unregister();
    });

    it('overwrites a session registered with the same id at raw-registry level', () => {
      const { session: s1 } = createTestSession('dup-session');
      const { session: s2 } = createTestSession('dup-session');
      registerSSESession(s1);
      registerSSESession(s2);
      expect(getSSESession('dup-session')).toBe(s2);
      unregisterSSESession('dup-session');
    });

    it('unregisters a session', () => {
      const { session } = createTestSession('sess-to-remove');
      registerSSESession(session);
      unregisterSSESession('sess-to-remove');
      expect(getSSESession('sess-to-remove')).toBeUndefined();
    });

    it('unregister callback removes the session', () => {
      const { session } = createTestSession('sess-callback');
      const unregister = registerSSESession(session);
      unregister();
      expect(getSSESession('sess-callback')).toBeUndefined();
    });
  });

  describe('sendSSEEvent', () => {
    it('sends event to a live session', () => {
      const { session, sentEvents } = createTestSession('live-session');
      registerSSESession(session);
      const result = sendSSEEvent('live-session', 'progress', { step: '1', message: 'hi' });
      expect(result).toBe(true);
      expect(sentEvents).toHaveLength(1);
      expect(sentEvents[0]).toEqual({ event: 'progress', data: { step: '1', message: 'hi' } });
    });

    it('returns false for unknown session', () => {
      expect(sendSSEEvent('unknown-session', 'progress', {})).toBe(false);
    });

    it('returns false and survives when session send throws', () => {
      const { session } = createTestSession('throwing-session');
      session.send = () => {
        throw new Error('controller closed');
      };
      registerSSESession(session);
      expect(sendSSEEvent('throwing-session', 'progress', {})).toBe(false);
    });
  });

  describe('sendMCPProgress', () => {
    it('sends structured progress payload', () => {
      const { session, sentEvents } = createTestSession('progress-session');
      registerSSESession(session);
      const result = sendMCPProgress('progress-session', 'payout_submitted', 'Payout submitted', {
        progress: 50,
        data: { batch_id: 'B-123' },
      });
      expect(result).toBe(true);
      const payload = sentEvents[0]!.data as Record<string, unknown>;
      expect(payload.step).toBe('payout_submitted');
      expect(payload.message).toBe('Payout submitted');
      expect(payload.progress).toBe(50);
      expect(payload.data).toEqual({ batch_id: 'B-123' });
      expect(typeof payload.timestamp).toBe('number');
    });

    it('no-ops safely when no session id provided', () => {
      expect(sendMCPProgress(undefined, 'step', 'msg')).toBe(false);
    });
  });

  describe('session caps (DoS protection)', () => {
    it('rejects duplicate session ids (hijack protection)', () => {
      const { session } = createTestSession('cap-dup-12345');
      expect(openSSESession(session, '10.0.0.1')).toBe(true);
      const { session: attacker } = createTestSession('cap-dup-12345');
      expect(openSSESession(attacker, '10.0.0.2')).toBe(false);
      // original holder unaffected
      expect(getSSESession('cap-dup-12345')).toBe(session);
      releaseSSESessionSlot('cap-dup-12345');
    });

    it('enforces per-IP session cap', () => {
      expect(SESSION_CAPS.sessionsPerIp).toBeGreaterThan(0);
      for (let i = 0; i < SESSION_CAPS.sessionsPerIp; i++) {
        const id = `per-ip-${String(i).padStart(4, '0')}`;
        const { session } = createTestSession(id);
        expect(openSSESession(session, '10.9.9.9')).toBe(true);
      }
      // 11th from same IP rejected, other IPs unaffected
      const { session } = createTestSession('per-ip-over');
      expect(openSSESession(session, '10.9.9.9')).toBe(false);
      const { session: otherIp } = createTestSession('per-ip-other');
      expect(openSSESession(otherIp, '10.8.8.8')).toBe(true);
      // 10th from another IP okay
      const { session: otherIp2 } = createTestSession('per-ip-other2');
      expect(openSSESession(otherIp2, '10.8.8.8')).toBe(true);

      // cleanup
      for (let i = 0; i < SESSION_CAPS.sessionsPerIp; i++) {
        releaseSSESessionSlot(`per-ip-${String(i).padStart(4, '0')}`);
      }
      releaseSSESessionSlot('per-ip-other');
      releaseSSESessionSlot('per-ip-other2');
    });

    it('enforces total session cap', () => {
      // Take up to the cap
      for (let i = 0; i < SESSION_CAPS.totalSessions; i++) {
        const id = `tcap-${String(i).padStart(4, '0')}`;
        const { session } = createTestSession(id);
        expect(openSSESession(session, `198.51.100.${i % 10}`)).toBe(true);
      }
      const { session: extra } = createTestSession('tcap-over');
      expect(openSSESession(extra, '203.0.113.1')).toBe(false);

      // release two rooms — reclaim after release
      releaseSSESessionSlot('tcap-0000');
      releaseSSESessionSlot('tcap-0001');
      const { session: after } = createTestSession('tcap-after');
      expect(openSSESession(after, '203.0.113.1')).toBe(true);
      releaseSSESessionSlot('tcap-after');
      // purge remaining for other tests
      for (let i = 2; i < SESSION_CAPS.totalSessions; i++) {
        releaseSSESessionSlot(`tcap-${String(i).padStart(4, '0')}`);
      }
    });

    it('releaseSSESessionSlot frees per-IP slots and unregisters', () => {
      const { session } = createTestSession('slot-freed-1');
      expect(openSSESession(session, '172.16.0.1')).toBe(true);
      releaseSSESessionSlot('slot-freed-1');
      expect(getSSESession('slot-freed-1')).toBeUndefined();
      const { session: again } = createTestSession('slot-freed-2');
      expect(openSSESession(again, '172.16.0.1')).toBe(true);
      releaseSSESessionSlot('slot-freed-2');
    });

    it('stale cleanup releases IP slots', () => {
      const { session } = createTestSession('stale-ip-12345');
      const registration = { ...session, createdAt: Date.now() - 10 * 60_000 };
      openSSESession(registration, '172.20.0.1');
      cleanupStaleSessions();
      expect(getSSESession('stale-ip-12345')).toBeUndefined();
      const { session: after } = createTestSession('stale-ip-after');
      expect(openSSESession(after, '172.20.0.1')).toBe(true);
      releaseSSESessionSlot('stale-ip-after');
    });
  });

  describe('cleanupStaleSessions', () => {
    it('removes sessions older than max age', () => {
      const { session } = createTestSession('stale-session');
      const registration = { ...session, createdAt: Date.now() - 10 * 60_000 };
      registerSSESession(registration);
      const { session: fresh } = createTestSession('fresh-session');
      registerSSESession(fresh);

      const cleaned = cleanupStaleSessions();
      expect(cleaned).toBe(1);
      expect(getSSESession('stale-session')).toBeUndefined();
      expect(getSSESession('fresh-session')).toBeDefined();
    });

    it('returns 0 when no sessions are stale', () => {
      const { session } = createTestSession('recent-session');
      registerSSESession(session);
      expect(cleanupStaleSessions()).toBe(0);
      expect(getSSESession('recent-session')).toBeDefined();
    });
  });
});
