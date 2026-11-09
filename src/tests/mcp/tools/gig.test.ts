import { describe, it, expect } from 'vitest';
import {
  gigTools,
  gigToolSchemas,
  createGigJobInputSchema,
  completeMilestoneInputSchema,
} from '@/lib/mcp/tools/gig';

describe('Gig Tool Schemas', () => {
  describe('Tool definitions', () => {
    it('exports 2 gig tools', () => {
      expect(gigTools).toHaveLength(2);
    });

    it('each tool has required properties', () => {
      for (const tool of gigTools) {
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
      const names = gigTools.map(t => t.name);
      expect(names).toEqual(['create_gig_job', 'complete_milestone']);
    });
  });

  describe('create_gig_job schema', () => {
    it('validates required fields', () => {
      const valid = {
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [
          { name: 'Design', percentage: 40 },
          { name: 'Development', percentage: 60 },
        ],
      };
      const result = createGigJobInputSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
      }
    });

    it('rejects missing title', () => {
      const result = createGigJobInputSchema.safeParse({
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [{ name: 'Design', percentage: 100 }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid freelancer email', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'not-an-email',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [{ name: 'Design', percentage: 100 }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid client email', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'not-an-email',
        total_budget: 1000,
        milestones: [{ name: 'Design', percentage: 100 }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive budget', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 0,
        milestones: [{ name: 'Design', percentage: 100 }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty milestones', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects more than 20 milestones', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: Array.from({ length: 21 }, (_, i) => ({ name: `M${i}`, percentage: 5 })),
      });
      expect(result.success).toBe(false);
    });

    it('rejects milestone percentages that do not sum to 100', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [
          { name: 'Design', percentage: 40 },
          { name: 'Development', percentage: 50 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive milestone percentage', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [
          { name: 'Design', percentage: 0 },
          { name: 'Development', percentage: 100 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid currency enum', () => {
      for (const currency of ['USD', 'KES', 'NGN', 'PYUSD']) {
        const result = createGigJobInputSchema.safeParse({
          title: 'Build landing page',
          freelancer_email: 'freelancer@example.com',
          client_email: 'client@example.com',
          total_budget: 1000,
          currency,
          milestones: [{ name: 'Design', percentage: 100 }],
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid currency', () => {
      const result = createGigJobInputSchema.safeParse({
        title: 'Build landing page',
        freelancer_email: 'freelancer@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        currency: 'INVALID',
        milestones: [{ name: 'Design', percentage: 100 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('complete_milestone schema', () => {
    it('validates with milestone_index', () => {
      const result = completeMilestoneInputSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
        milestone_index: 1,
      });
      expect(result.success).toBe(true);
    });

    it('validates with milestone_name', () => {
      const result = completeMilestoneInputSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
        milestone_name: 'Design',
      });
      expect(result.success).toBe(true);
    });

    it('rejects when neither index nor name provided', () => {
      const result = completeMilestoneInputSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(false);
    });

    it('rejects zero or negative milestone_index', () => {
      const result = completeMilestoneInputSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
        milestone_index: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid job_id', () => {
      const result = completeMilestoneInputSchema.safeParse({
        job_id: 'not-a-uuid',
        milestone_index: 1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('gigToolSchemas object', () => {
    it('contains all 2 schemas', () => {
      const keys = Object.keys(gigToolSchemas);
      expect(keys).toHaveLength(2);
      expect(keys).toEqual(['create_gig_job', 'complete_milestone']);
    });
  });
});
