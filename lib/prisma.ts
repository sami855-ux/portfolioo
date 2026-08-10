import path from 'path';
import { config } from 'dotenv';
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Ensure environment variables from .env.local are loaded if Next.js hasn't loaded them yet
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(process.cwd(), '.env.local') });
  config({ path: path.resolve(process.cwd(), '.env') });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables or .env.local');
  }

  // Use pg driver adapter for PostgreSQL (including Neon TCP connection)
  const pool = new PgPool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
