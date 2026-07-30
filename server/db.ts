import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function sanitizeDbUrl(url: string): string {
  const u = new URL(url);
  ['channel_binding'].forEach(p => u.searchParams.delete(p));
  return u.toString();
}

const adapter = new PrismaPg(sanitizeDbUrl(process.env.DATABASE_URL!));

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
