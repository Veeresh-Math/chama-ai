import { z } from 'zod';
import { CallToolResult } from '@/types/mcp';
import { db } from '@/db';
import { gigJobs, gigMilestones, transactions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSplitPayment } from '@/lib/paypal';
import { verifyAgent } from '@/lib/mcp/kya';

// ============================================
// Zod Input Schemas
// ============================================

export const milestoneInputSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  percentage: z.number().int().min(1).max(100),
});

export const createGigJobInputSchema = z
  .object({
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    freelancer_email: z.string().email(),
    client_email: z.string().email(),
    client_name: z.string().max(255).optional(),
    total_budget: z.number().positive(),
    currency: z.enum(['USD', 'KES', 'NGN', 'PYUSD']).default('USD'),
    milestones: z.array(milestoneInputSchema).min(1).max(20),
  })
  .superRefine((data, ctx) => {
    const total = data.milestones.reduce((sum, m) => sum + m.percentage, 0);
    if (total !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Milestone percentages must sum to 100 (got ${total})`,
        path: ['milestones'],
      });
    }
  });

export const completeMilestoneInputSchema = z
  .object({
    job_id: z.string().uuid(),
    milestone_index: z.number().int().min(1).optional(),
    milestone_name: z.string().min(1).max(255).optional(),
    agent_id: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.milestone_index === undefined && data.milestone_name === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either milestone_index or milestone_name is required',
        path: ['milestone_index'],
      });
    }
  });

// ============================================
// Money Helpers (cents-based to avoid float drift)
// ============================================

function toCents(amount: number): number {
  return Math.round(amount * 100);
}

function fromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

function computeMilestoneAmounts(
  totalBudget: number,
  percentages: number[]
): number[] {
  const budgetCents = toCents(totalBudget);
  const amounts: number[] = [];
  let allocatedCents = 0;

  for (let i = 0; i < percentages.length; i++) {
    const isLast = i === percentages.length - 1;
    if (isLast) {
      // Last milestone absorbs rounding remainder so total == budget exactly
      amounts.push(budgetCents - allocatedCents);
    } else {
      const cents = Math.round((budgetCents * percentages[i]) / 100);
      amounts.push(cents);
      allocatedCents += cents;
    }
  }
  return amounts;
}

// ============================================
// Handler Functions
// ============================================

async function findOrCreateUser(email: string) {
  let user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email,
        fullName: email.split('@')[0],
      })
      .returning();
    user = newUser;
  }
  return user;
}

async function handleCreateGigJob(
  params: z.infer<typeof createGigJobInputSchema>
): Promise<CallToolResult> {
  try {
    const freelancer = await findOrCreateUser(params.freelancer_email);

    const amounts = computeMilestoneAmounts(
      params.total_budget,
      params.milestones.map(m => m.percentage)
    );

    const [job] = await db
      .insert(gigJobs)
      .values({
        title: params.title,
        description: params.description,
        freelancerId: freelancer.id,
        clientEmail: params.client_email,
        clientName: params.client_name,
        totalBudget: params.total_budget.toFixed(2),
        currency: params.currency,
        status: 'active',
      })
      .returning();

    const insertedMilestones = [];
    for (let i = 0; i < params.milestones.length; i++) {
      const m = params.milestones[i];
      const [milestone] = await db
        .insert(gigMilestones)
        .values({
          jobId: job.id,
          name: m.name,
          description: m.description,
          percentage: m.percentage,
          amount: fromCents(amounts[i]),
        })
        .returning();
      insertedMilestones.push(milestone);
    }

    const milestoneSummary = insertedMilestones
      .map((m, i) => `${i + 1}. ${m.name} — ${m.amount} ${params.currency} (${m.percentage}%)`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Created gig job "${job.title}" (ID: ${job.id}). Budget: ${params.total_budget} ${params.currency}. Freelancer: ${params.freelancer_email}. Client: ${params.client_email}. Milestones:\n${milestoneSummary}`,
        },
      ],
    };
  } catch (error) {
    console.error('[MCP] create_gig_job error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to create gig job: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

async function handleCompleteMilestone(
  params: z.infer<typeof completeMilestoneInputSchema>
): Promise<CallToolResult> {
  try {
    if (params.agent_id) {
      const kya = await verifyAgent(params.agent_id);
      if (!kya.verified) {
        return { content: [{ type: 'text', text: `KYA verification failed: ${kya.reason}` }], isError: true };
      }
    }

    const job = await db.query.gigJobs.findFirst({
      where: eq(gigJobs.id, params.job_id),
      with: { milestones: { orderBy: (m, { asc: ascFn }) => [ascFn(m.createdAt)] } },
    });

    if (!job) {
      return {
        content: [{ type: 'text', text: `Gig job not found: ${params.job_id}` }],
        isError: true,
      };
    }

    if (job.status === 'completed' || job.status === 'paid') {
      return {
        content: [{ type: 'text', text: `Gig job ${job.id} is already completed` }],
        isError: true,
      };
    }

    const milestones = job.milestones;
    let milestone;
    if (params.milestone_index !== undefined) {
      if (params.milestone_index < 1 || params.milestone_index > milestones.length) {
        return {
          content: [
            {
              type: 'text',
              text: `Milestone index ${params.milestone_index} out of range (1-${milestones.length}) for job ${job.id}`,
            },
          ],
          isError: true,
        };
      }
      milestone = milestones[params.milestone_index - 1];
    } else if (params.milestone_name) {
      milestone = milestones.find(m => m.name === params.milestone_name);
      if (!milestone) {
        return {
          content: [
            {
              type: 'text',
              text: `Milestone "${params.milestone_name}" not found in job ${job.id}`,
            },
          ],
          isError: true,
        };
      }
    } else {
      return {
        content: [{ type: 'text', text: 'Either milestone_index or milestone_name is required' }],
        isError: true,
      };
    }

    if (milestone.isCompleted) {
      return {
        content: [
          { type: 'text', text: `Milestone "${milestone.name}" is already completed` },
        ],
        isError: true,
      };
    }

    const freelancerUser = await db.query.users.findFirst({
      where: eq(users.id, job.freelancerId),
    });

    if (!freelancerUser) {
      return {
        content: [{ type: 'text', text: `Freelancer user not found for job ${job.id}` }],
        isError: true,
      };
    }

    // Trigger payment to freelancer for this milestone
    // Deterministic batch id (no timestamp): PayPal rejects duplicate
    // sender batch ids within 30 days, so a retried attempt cannot double-pay
    const senderBatchId = `milestone_${milestone.id}`;
    const payout = await createSplitPayment({
      senderBatchId,
      emailSubject: `Milestone payment for ${job.title}`,
      items: [
        {
          recipient_type: 'EMAIL' as const,
          amount: { value: milestone.amount, currency: job.currency },
          receiver: freelancerUser.email,
          note: `${milestone.name} — ${job.title}`,
        },
      ],
    });

    await db
      .update(gigMilestones)
      .set({
        isCompleted: true,
        completedAt: new Date(),
        paypalPaymentId: payout.batch_header.payout_batch_id,
      })
      .where(eq(gigMilestones.id, milestone.id));

    await db.insert(transactions).values({
      userId: job.freelancerId,
      type: 'gig_milestone',
      amount: milestone.amount,
      currency: job.currency,
      description: `Milestone payment: ${milestone.name} (${job.title})`,
      referenceId: milestone.id,
      referenceType: 'gig_milestone',
      paypalTransactionId: payout.batch_header.payout_batch_id,
      status: 'completed',
    });

    // Complete job when all milestones are done
    const allCompleted = milestones.every(
      m => m.isCompleted || m.id === milestone.id
    );

    let jobCompletionNote = '';
    if (allCompleted) {
      await db
        .update(gigJobs)
        .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
        .where(eq(gigJobs.id, job.id));
      jobCompletionNote = ' All milestones complete — job marked as completed.';
    } else {
      const done = milestones.filter(
        m => m.isCompleted || m.id === milestone.id
      ).length;
      jobCompletionNote = ` Progress: ${done}/${milestones.length} milestones complete.`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Milestone "${milestone.name}" completed.${jobCompletionNote} Payout: ${milestone.amount} ${job.currency} to ${freelancerUser.email}. Payout Batch ID: ${payout.batch_header.payout_batch_id}`,
        },
      ],
    };
  } catch (error) {
    console.error('[MCP] complete_milestone error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Failed to complete milestone: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

// ============================================
// Tool Definitions
// ============================================

export const createGigJobTool = {
  name: 'create_gig_job',
  description: 'Create a new gig job with milestone-based escrow payments',
  inputSchema: {
    type: 'object' as const,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      freelancer_email: { type: 'string', format: 'email' },
      client_email: { type: 'string', format: 'email' },
      client_name: { type: 'string', maxLength: 255 },
      total_budget: { type: 'number', minimum: 0.01 },
      currency: { type: 'string', enum: ['USD', 'KES', 'NGN', 'PYUSD'], default: 'USD' },
      milestones: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string', maxLength: 2000 },
            percentage: { type: 'integer', minimum: 1, maximum: 100 },
          },
          required: ['name', 'percentage'],
        },
        minItems: 1,
        maxItems: 20,
        description: 'Milestone percentages must sum to 100',
      },
    },
    required: ['title', 'freelancer_email', 'client_email', 'total_budget', 'milestones'],
  },
  handler: handleCreateGigJob,
} as const;

export const completeMilestoneTool = {
  name: 'complete_milestone',
  description: 'Mark a gig milestone complete, releasing escrow payment to the freelancer (agent_id triggers KYA verification)',
  inputSchema: {
    type: 'object' as const,
    properties: {
      job_id: { type: 'string', format: 'uuid' },
      milestone_index: { type: 'integer', minimum: 1, description: '1-based milestone order' },
      milestone_name: { type: 'string', minLength: 1, maxLength: 255 },
      agent_id: { type: 'string', minLength: 1, description: 'Optional verified agent identity (KYA)' },
    },
    required: ['job_id'],
  },
  handler: handleCompleteMilestone,
} as const;

export const gigTools = [createGigJobTool, completeMilestoneTool] as const;

export const gigToolSchemas = {
  create_gig_job: createGigJobInputSchema,
  complete_milestone: completeMilestoneInputSchema,
} as const;
