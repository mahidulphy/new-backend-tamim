import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const usersRouter = Router();

const userSelect = {
  id: true, name: true, email: true, avatar: true, role: true,
  status: true, lastLogin: true, phone: true, createdAt: true, updatedAt: true,
} as const;

const n = (s: any) => s.nullable().transform((v: any) => v === null ? undefined : v).optional();

const updateProfileSchema = z.object({
  name: n(z.string().min(1).max(200)),
  email: n(z.string().email()),
  avatar: n(z.string()),
  phone: n(z.string()),
});

usersRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ select: userSelect, take: limit, skip }),
      prisma.user.count(),
    ]);
    res.json({ data: users, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

usersRouter.get('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: userSelect,
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

usersRouter.put('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    const userId = req.session.userId;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: parsed,
      select: userSelect,
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});
