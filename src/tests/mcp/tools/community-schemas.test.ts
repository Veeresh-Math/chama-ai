import { describe, it, expect } from 'vitest';
import {
  communityTools,
  communityToolSchemas,
  createChamaInputSchema,
  joinChamaInputSchema,
  contributeInputSchema,
  distributeFundsInputSchema,
  getCommunityStateInputSchema,
  analyzeTrustInputSchema,
} from '@/lib/mcp/tools/community';

describe('Community Tool Schemas', () => {
  describe('Tool definitions', () => {
    it('exports 6 community tools', () => {
      expect(communityTools).toHaveLength(6);
    });

    it('each tool has required properties', () => {
      for (const tool of communityTools) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool).toHaveProperty('handler');
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(typeof tool.handler).toBe('function');
      }
    });

    it('tool names match expected', () => {
      const names = communityTools.map(t => t.name);
      expect(names).toEqual([
        'create_chama',
        'join_chama',
        'contribute',
        'distribute_funds',
        'get_community_state',
        'analyze_trust',
      ]);
    });
  });

  describe('create_chama schema', () => {
    it('validates required fields', () => {
      const valid = {
        name: 'Test Chama',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: ['member1@example.com', 'member2@example.com'],
      };
      const result = createChamaInputSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('applies default currency', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: ['member@example.com'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
      }
    });

    it('applies default auto_distribute', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: ['member@example.com'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.auto_distribute).toBe(false);
      }
    });

    it('rejects missing name', () => {
      const result = createChamaInputSchema.safeParse({
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: ['member@example.com'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'invalid-email',
        monthly_contribution: 100,
        member_emails: ['member@example.com'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive contribution', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 0,
        member_emails: ['member@example.com'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty member_emails', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects too many members', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: Array(51).fill('member@example.com'),
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid currency enum', () => {
      for (const currency of ['USD', 'KES', 'NGN', 'PYUSD']) {
        const result = createChamaInputSchema.safeParse({
          name: 'Test',
          owner_email: 'owner@example.com',
          monthly_contribution: 100,
          member_emails: ['member@example.com'],
          currency,
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid currency', () => {
      const result = createChamaInputSchema.safeParse({
        name: 'Test',
        owner_email: 'owner@example.com',
        monthly_contribution: 100,
        member_emails: ['member@example.com'],
        currency: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('join_chama schema', () => {
    it('validates required fields', () => {
      const result = joinChamaInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'user@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional share_percentage', () => {
      const result = joinChamaInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'user@example.com',
        share_percentage: 50,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid share_percentage range', () => {
      const result = joinChamaInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'user@example.com',
        share_percentage: 150,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('contribute schema', () => {
    it('validates required fields', () => {
      const result = contributeInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        member_email: 'member@example.com',
        amount: 50,
      });
      expect(result.success).toBe(true);
    });

    it('applies default currency', () => {
      const result = contributeInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        member_email: 'member@example.com',
        amount: 50,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
      }
    });

    it('rejects non-positive amount', () => {
      const result = contributeInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        member_email: 'member@example.com',
        amount: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('distribute_funds schema', () => {
    it('validates required field', () => {
      const result = distributeFundsInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });

    it('accepts triggered_by enum', () => {
      for (const triggered of ['manual', 'auto', 'agent']) {
        const result = distributeFundsInputSchema.safeParse({
          community_id: '123e4567-e89b-12d3-a456-426614174000',
          triggered_by: triggered,
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid triggered_by', () => {
      const result = distributeFundsInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        triggered_by: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('get_community_state schema', () => {
    it('validates required field', () => {
      const result = getCommunityStateInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('analyze_trust schema', () => {
    it('validates required field', () => {
      const result = analyzeTrustInputSchema.safeParse({
        community_id: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('communityToolSchemas object', () => {
    it('contains all 6 schemas', () => {
      const keys = Object.keys(communityToolSchemas);
      expect(keys).toHaveLength(6);
      expect(keys).toEqual([
        'create_chama',
        'join_chama',
        'contribute',
        'distribute_funds',
        'get_community_state',
        'analyze_trust',
      ]);
    });
  });
});