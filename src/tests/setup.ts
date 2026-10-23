import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.PAYPAL_MODE = 'sandbox';
  process.env.PAYPAL_CLIENT_ID = 'test_client_id';
  process.env.PAYPAL_CLIENT_SECRET = 'test_client_secret';
  process.env.OPENAI_API_KEY = 'test_openai_key';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  process.env.MCP_API_KEYS = JSON.stringify({
    'test-key-1': 'user-1',
    'test-key-2': 'user-2',
  });
});

afterAll(() => {
  // Cleanup if needed
});