import { prisma } from '../db';

export function isDevAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH === 'true';
}

export async function getDevBypassUser() {
  const superAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });
  if (superAdmin) return superAdmin;

  return prisma.user.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });
}
