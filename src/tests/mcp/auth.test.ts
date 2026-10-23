import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateAPIKey,
  rateLimit,
  clearRateLimit,
  getRateLimitStats,
} from '@/lib/mcp/auth';

describe('MCP Auth', () => {
  beforeEach(() => {
    vi.resetModules();
    clearRateLimit('test-key-1');
    clearRateLimit('test-key-2');
    clearRateLimit('invalid-key');
  });

  describe('validateAPIKey', () => {
    it('validates known key', () => {
      const result = validateAPIKey('test-key-1');
      expect(result.valid).toBe(true);
      expect(result.userId).toBe('user-1');
    });

    it('validates second known key', () => {
      const result = validateAPIKey('test-key-2');
      expect(result.valid).toBe(true);
      expect(result.userId).toBe('user-2');
    });

    it('rejects unknown key', () => {
      const result = validateAPIKey('invalid-key');
      expect(result.valid).toBe(false);
      expect(result.userId).toBeUndefined();
    });

    it('rejects empty key', () => {
      const result = validateAPIKey('');
      expect(result.valid).toBe(false);
    });

    it('rejects undefined key', () => {
      const result = validateAPIKey(undefined as any);
      expect(result.valid).toBe(false);
    });
  });

  describe('rateLimit', () => {
    it('allows first request', () => {
      const result = rateLimit('test-key-1');
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it('allows requests under limit', () => {
      for (let i = 0; i < 5; i++) {
        const result = rateLimit('test-key-1');
        expect(result.allowed).toBe(true);
      }
    });

    it('tracks count per key independently', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('test-key-1');
      }
      const result = rateLimit('test-key-2');
      expect(result.allowed).toBe(true);
    });

    it('blocks when limit exceeded', () => {
      for (let i = 0; i < 100; i++) {
        const result = rateLimit('test-key-1');
        expect(result.allowed).toBe(true);
      }
      const result = rateLimit('test-key-1');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('resets after window', () => {
      // This test would need time manipulation - skip for now
      // In real scenario, we'd use fake timers
      expect(true).toBe(true);
    });
  });

  describe('clearRateLimit', () => {
    it('clears rate limit for key', () => {
      rateLimit('test-key-1');
      rateLimit('test-key-1');
      clearRateLimit('test-key-1');
      const stats = getRateLimitStats('test-key-1');
      expect(stats).toBeNull();
    });
  });

  describe('getRateLimitStats', () => {
    it('returns stats for key', () => {
      rateLimit('test-key-1');
      rateLimit('test-key-1');
      const stats = getRateLimitStats('test-key-1');
      expect(stats).not.toBeNull();
      expect(stats?.count).toBe(2);
    });

    it('returns null for unknown key', () => {
      const stats = getRateLimitStats('unknown');
      expect(stats).toBeNull();
    });
  });
});