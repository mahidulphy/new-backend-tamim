import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const logsRouter = Router();

function n(s: any) { return s.nullable().transform((v: any) => v === null ? undefined : v).optional(); }

const createLogSchema = z.object({
  adminId: z.string().min(1),
  adminName: z.string().min(1).max(200),
  action: z.enum(['MEMORY_CREATED', 'MEMORY_UPDATED', 'MEMORY_DELETED', 'MEMORY_ARCHIVED', 'QR_GENERATED', 'TEMPLATE_UPDATED', 'SETTINGS_CHANGED', 'ADMIN_LOGIN', 'ORDER_UPDATED']),
  target: z.string().min(1).max(300),
  description: z.string().min(1).max(1000),
  ipAddress: n(z.string()).default('127.0.0.1'),
  browser: n(z.string()).default('Browser App Engine'),
});

logsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip }),
      prisma.activityLog.count(),
    ]);
    res.json({ data: logs, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

logsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createLogSchema.parse(req.body);
    const log = await prisma.activityLog.create({ data: parsed });
    res.json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create log' });
  }
});
