interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100;

function getAPIKeys(): Record<string, string> {
  const envKeys = process.env.MCP_API_KEYS;
  if (!envKeys) {
    return {};
  }
  try {
    return JSON.parse(envKeys);
  } catch (error) {
    console.error('[MCP Auth] Failed to parse MCP_API_KEYS:', error);
    return {};
  }
}

export function validateAPIKey(key: string): { valid: boolean; userId?: string } {
  if (!key) {
    return { valid: false };
  }
  const apiKeys = getAPIKeys();
  const userId = apiKeys[key];
  return { valid: !!userId, userId };
}

export function rateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

export function getAuthHeaders(key: string): Record<string, string> {
  const validation = validateAPIKey(key);
  if (!validation.valid) {
    return {
      'WWW-Authenticate': 'Bearer error="invalid_token"',
    };
  }
  return {};
}

export function getRateLimitHeaders(allowed: boolean, retryAfter?: number): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(MAX_REQUESTS),
    'X-RateLimit-Remaining': String(Math.max(0, MAX_REQUESTS - (rateLimitStore.get('default')?.count || 0))),
  };
  if (!allowed && retryAfter) {
    headers['Retry-After'] = String(retryAfter);
  }
  return headers;
}

export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

export function getRateLimitStats(key: string): { count: number; resetAt: number } | null {
  return rateLimitStore.get(key) || null;
}