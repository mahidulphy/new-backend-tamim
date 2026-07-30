import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const newsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

newsletterRouter.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = subscribeSchema.parse(req.body);

    const recent = await prisma.newsletterSubscriber.findFirst({
      where: { email, isActive: true },
    });
    if (recent) {
      return res.json({ message: 'Already subscribed.' });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing && !existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true, unsubscribedAt: null },
      });
      return res.json({ message: 'Subscription reactivated.' });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

newsletterRouter.get('/subscribers', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' }, take: limit, skip }),
      prisma.newsletterSubscriber.count(),
    ]);
    res.json({ data, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

newsletterRouter.delete('/subscribers/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    await prisma.newsletterSubscriber.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    res.status(500).json({ error: 'Failed to remove subscriber' });
  }
});
