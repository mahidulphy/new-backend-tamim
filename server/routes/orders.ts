import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const ordersRouter = Router();

const statusSchema = z.object({
  orderStatus: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
});

ordersRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip }),
      prisma.order.count(),
    ]);
    res.json({ data: orders, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

ordersRouter.put('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const { orderStatus } = statusSchema.parse(req.body);
    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus },
    });
    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
});
