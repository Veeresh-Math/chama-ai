import { pgTable, uuid, varchar, text, timestamp, decimal, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (synced with Supabase Auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Supabase Auth UUID
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  paypalEmail: varchar('paypal_email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Communities (Chamas/Tontines)
export const communities = pgTable('communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  monthlyContribution: decimal('monthly_contribution', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  autoDistribute: boolean('auto_distribute').default(false),
  trustScore: integer('trust_score').default(0),
  totalFunds: decimal('total_funds', { precision: 12, scale: 2 }).default('0'),
  paypalPayoutBatchId: varchar('paypal_payout_batch_id', { length: 100 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  ownerIdx: index('communities_owner_idx').on(table.ownerId),
  activeIdx: index('communities_active_idx').on(table.isActive),
}));

// Community Members
export const communityMembers = pgTable('community_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  communityId: uuid('community_id').references(() => communities.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  sharePercentage: decimal('share_percentage', { precision: 5, scale: 2 }).default('0'),
  totalContributed: decimal('total_contributed', { precision: 10, scale: 2 }).default('0'),
  trustScore: integer('trust_score').default(50),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
}, (table) => ({
  communityIdx: index('community_members_community_idx').on(table.communityId),
  userIdx: index('community_members_user_idx').on(table.userId),
  emailIdx: index('community_members_email_idx').on(table.email),
}));

// Contributions
export const contributions = pgTable('contributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  communityId: uuid('community_id').references(() => communities.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => communityMembers.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  paypalPaymentId: varchar('paypal_payment_id', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, completed, failed, refunded
  contributedAt: timestamp('contributed_at').defaultNow().notNull(),
}, (table) => ({
  communityIdx: index('contributions_community_idx').on(table.communityId),
  memberIdx: index('contributions_member_idx').on(table.memberId),
  statusIdx: index('contributions_status_idx').on(table.status),
}));

// Distributions (payouts)
export const distributions = pgTable('distributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  communityId: uuid('community_id').references(() => communities.id, { onDelete: 'cascade' }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  paypalPayoutBatchId: varchar('paypal_payout_batch_id', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, processing, completed, failed
  triggeredBy: varchar('triggered_by', { length: 50 }), // manual, auto, agent
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  communityIdx: index('distributions_community_idx').on(table.communityId),
  statusIdx: index('distributions_status_idx').on(table.status),
}));

// Gig Jobs
export const gigJobs = pgTable('gig_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  freelancerId: uuid('freelancer_id').references(() => users.id).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  clientName: varchar('client_name', { length: 255 }),
  totalBudget: decimal('total_budget', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  status: varchar('status', { length: 20 }).default('active'), // active, completed, cancelled, paid
  paypalPaymentId: varchar('paypal_payment_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  freelancerIdx: index('gig_jobs_freelancer_idx').on(table.freelancerId),
  statusIdx: index('gig_jobs_status_idx').on(table.status),
}));

// Gig Milestones
export const gigMilestones = pgTable('gig_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => gigJobs.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  percentage: integer('percentage').notNull(), // percentage of total budget
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  paypalPaymentId: varchar('paypal_payment_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  jobIdx: index('gig_milestones_job_idx').on(table.jobId),
}));

// Transactions (unified ledger)
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 30 }).notNull(), // contribution, distribution, gig_payment, gig_milestone, payout
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  description: text('description'),
  referenceId: uuid('reference_id'), // communityId, gigJobId, etc.
  referenceType: varchar('reference_type', { length: 30 }), // community, gig_job, gig_milestone
  paypalTransactionId: varchar('paypal_transaction_id', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('transactions_user_idx').on(table.userId),
  typeIdx: index('transactions_type_idx').on(table.type),
  referenceIdx: index('transactions_reference_idx').on(table.referenceId, table.referenceType),
  createdIdx: index('transactions_created_idx').on(table.createdAt),
}));

// Agent Conversations
export const agentConversations = pgTable('agent_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }),
  context: jsonb('context'), // community data, gig data, transactions
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('agent_conversations_user_idx').on(table.userId),
}));

// Agent Messages
export const agentMessages = pgTable('agent_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => agentConversations.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // user, assistant, tool
  content: text('content').notNull(),
  toolCalls: jsonb('tool_calls'),
  toolResults: jsonb('tool_results'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('agent_messages_conversation_idx').on(table.conversationId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedCommunities: many(communities),
  communityMemberships: many(communityMembers),
  gigJobs: many(gigJobs),
  transactions: many(transactions),
  agentConversations: many(agentConversations),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  owner: one(users, { fields: [communities.ownerId], references: [users.id] }),
  members: many(communityMembers),
  contributions: many(contributions),
  distributions: many(distributions),
}));

export const communityMembersRelations = relations(communityMembers, ({ one, many }) => ({
  community: one(communities, { fields: [communityMembers.communityId], references: [communities.id] }),
  user: one(users, { fields: [communityMembers.userId], references: [users.id] }),
  contributions: many(contributions),
}));

export const contributionsRelations = relations(contributions, ({ one }) => ({
  community: one(communities, { fields: [contributions.communityId], references: [communities.id] }),
  member: one(communityMembers, { fields: [contributions.memberId], references: [communityMembers.id] }),
}));

export const distributionsRelations = relations(distributions, ({ one }) => ({
  community: one(communities, { fields: [distributions.communityId], references: [communities.id] }),
}));

export const gigJobsRelations = relations(gigJobs, ({ one, many }) => ({
  freelancer: one(users, { fields: [gigJobs.freelancerId], references: [users.id] }),
  milestones: many(gigMilestones),
}));

export const gigMilestonesRelations = relations(gigMilestones, ({ one }) => ({
  job: one(gigJobs, { fields: [gigMilestones.jobId], references: [gigJobs.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));

export const agentConversationsRelations = relations(agentConversations, ({ one, many }) => ({
  user: one(users, { fields: [agentConversations.userId], references: [users.id] }),
  messages: many(agentMessages),
}));

export const agentMessagesRelations = relations(agentMessages, ({ one }) => ({
  conversation: one(agentConversations, { fields: [agentMessages.conversationId], references: [agentConversations.id] }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type NewCommunityMember = typeof communityMembers.$inferInsert;
export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;
export type Distribution = typeof distributions.$inferSelect;
export type NewDistribution = typeof distributions.$inferInsert;
export type GigJob = typeof gigJobs.$inferSelect;
export type NewGigJob = typeof gigJobs.$inferInsert;
export type GigMilestone = typeof gigMilestones.$inferSelect;
export type NewGigMilestone = typeof gigMilestones.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type AgentConversation = typeof agentConversations.$inferSelect;
export type NewAgentConversation = typeof agentConversations.$inferInsert;
export type AgentMessage = typeof agentMessages.$inferSelect;
export type NewAgentMessage = typeof agentMessages.$inferInsert;