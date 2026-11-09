import { describe, it, expect } from 'vitest';
import { buildLlmsTxt } from '@/lib/mcp/discovery';
import { createMCPServer } from '@/lib/mcp/server';

const ALL_TOOLS = [
  'create_chama',
  'join_chama',
  'contribute',
  'distribute_funds',
  'get_community_state',
  'analyze_trust',
  'create_gig_job',
  'complete_milestone',
];

describe('llms.txt generation', () => {
  const llmsTxt = buildLlmsTxt(createMCPServer().listTools());

  it('has a top-level heading and description', () => {
    expect(llmsTxt.startsWith('# Cham.ai MCP Server')).toBe(true);
    expect(llmsTxt).toContain('Agent-to-agent commerce');
  });

  it('lists the MCP endpoint URL', () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    expect(llmsTxt).toContain(`${baseUrl}/api/mcp`);
  });

  it('includes auth instructions with x-api-key header', () => {
    expect(llmsTxt).toContain('x-api-key');
    expect(llmsTxt).toContain('Rate limit: 100 requests/minute');
  });

  it('documents all 8 tools with sections', () => {
    for (const tool of ALL_TOOLS) {
      expect(llmsTxt).toContain(`### ${tool}`);
    }
  });

  it('documents parameters for a representative tool', () => {
    expect(llmsTxt).toContain('`owner_email`');
    expect(llmsTxt).toContain('(required)');
    expect(llmsTxt).toContain('`monthly_contribution`');
  });

  it('includes JSON-RPC tools/call example', () => {
    expect(llmsTxt).toContain('"jsonrpc": "2.0"');
    expect(llmsTxt).toContain('"method": "tools/call"');
    expect(llmsTxt).toContain('"name": "create_chama"');
  });

  it('includes SSE streaming instructions', () => {
    expect(llmsTxt).toContain('/api/mcp/sse');
    expect(llmsTxt).toContain('session_id');
    expect(llmsTxt).toContain('payout_submitted');
  });

  it('includes troubleshooting codes', () => {
    expect(llmsTxt).toContain('-32601');
    expect(llmsTxt).toContain('-32602');
    expect(llmsTxt).toContain('429');
  });

  it('auto-updates when tool list changes (derived from registered tools)', () => {
    const tools = createMCPServer().listTools();
    for (const tool of tools) {
      expect(llmsTxt).toContain(`### ${tool.name}`);
    }
  });

  it('is plain text without null/undefined leaks', () => {
    expect(llmsTxt).not.toContain('undefined');
    expect(llmsTxt).not.toContain('null');
  });
});
