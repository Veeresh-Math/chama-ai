import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export * from './schema';