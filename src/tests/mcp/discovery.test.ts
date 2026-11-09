import { describe, it, expect } from 'vitest';
import { buildACPManifest } from '@/lib/mcp/discovery';
import { createMCPServer } from '@/lib/mcp/server';

function getRegisteredTools() {
  return createMCPServer().listTools();
}

describe('ACP Discovery Manifest', () => {
  it('includes all required top-level fields', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    expect(manifest).toHaveProperty('protocol_version');
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('description');
    expect(manifest).toHaveProperty('merchant_id');
    expect(manifest).toHaveProperty('endpoints');
    expect(manifest).toHaveProperty('capabilities');
    expect(manifest).toHaveProperty('categories');
    expect(manifest).toHaveProperty('trust_signals');
  });

  it('uses MCP protocol version 2024-11-05', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    expect(manifest.protocol_version).toBe('2024-11-05');
    expect(manifest.capabilities.protocol_version).toBe('2024-11-05');
  });

  it('lists all 9 registered tools in capabilities', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    expect(manifest.capabilities.tools).toHaveLength(9);
    expect(manifest.capabilities.tools).toContain('create_chama');
    expect(manifest.capabilities.tools).toContain('create_gig_job');
    expect(manifest.capabilities.tools).toContain('complete_milestone');
    expect(manifest.capabilities.tools).toContain('distribute_yield');
  });

  it('declares API key auth with rate limit', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    expect(manifest.capabilities.auth.type).toBe('api_key');
    expect(manifest.capabilities.auth.header).toBe('x-api-key');
    expect(manifest.capabilities.auth.rate_limit).toEqual({ requests: 100, window: '1 minute' });
  });

  it('exposes absolute endpoint URLs', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    expect(manifest.endpoints.mcp).toBe(`${baseUrl}/api/mcp`);
    expect(manifest.endpoints.sse).toBe(`${baseUrl}/api/mcp/sse`);
    expect(manifest.endpoints.discovery).toBe(`${baseUrl}/.well-known/agentic-commerce.json`);
    expect(manifest.endpoints.llms_txt).toBe(`${baseUrl}/api/mcp/llms.txt`);
  });

  it('includes relevant categories and trust signals', () => {
    const manifest = buildACPManifest(getRegisteredTools());
    expect(manifest.categories).toContain('financial_services');
    expect(manifest.categories).toContain('payments');
    expect(manifest.trust_signals.payments_provider).toBe('paypal');
    expect(Array.isArray(manifest.trust_signals.settlement_methods)).toBe(true);
    expect(Array.isArray(manifest.trust_signals.currencies)).toBe(true);
  });
});
