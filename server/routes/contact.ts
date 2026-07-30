import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const contactRouter = Router();

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

contactRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = createContactSchema.parse(req.body);

    const recent = await prisma.contactMessage.findFirst({
      where: { ipAddress: req.ip || req.socket.remoteAddress || '', createdAt: { gte: new Date(Date.now() - 60000) } },
    });
    if (recent) {
      return res.status(429).json({ error: 'Please wait before sending another message.' });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, message, ipAddress: req.ip || req.socket.remoteAddress || '' },
    });
    res.status(201).json({ id: contact.id, message: 'Message sent successfully.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

contactRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip }),
      prisma.contactMessage.count(),
    ]);
    res.json({ data, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

contactRouter.put('/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const updated = await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

contactRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
