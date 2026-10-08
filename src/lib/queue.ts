import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Job queue keys
export const QUEUE_KEYS = {
  MILESTONE_CHECK: 'queue:milestone_check',
  AUTO_DISTRIBUTE: 'queue:auto_distribute',
  AGENT_TASK: 'queue:agent_task',
  TRUST_SCORING: 'queue:trust_scoring',
} as const;

export async function enqueueJob(queue: string, payload: unknown, delayMs = 0) {
  const job = { payload, createdAt: Date.now() };
  if (delayMs > 0) {
    await redis.zadd(queue, { score: Date.now() + delayMs, member: JSON.stringify(job) });
  } else {
    await redis.lpush(queue, JSON.stringify(job));
  }
}

export async function dequeueJob(queue: string): Promise<unknown | null> {
  const job = await redis.rpop(queue);
  return job ? JSON.parse(job as string) : null;
}

export async function scheduleJob(queue: string, payload: unknown, runAt: Date) {
  const job = { payload, createdAt: Date.now() };
  await redis.zadd(queue, { score: runAt.getTime(), member: JSON.stringify(job) });
}

export async function getScheduledJobs(queue: string): Promise<unknown[]> {
  const now = Date.now();
  const jobs = await redis.zrangebyscore(queue, 0, now);
  if (jobs.length > 0) {
    await redis.zremrangebyscore(queue, 0, now);
  }
  return jobs.map(j => JSON.parse(j as string));
}