import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const templatesRouter = Router();

const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

templatesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(_req.query.limit as string) || 50, 100);
    const templates = await prisma.template.findMany({
      orderBy: { displayOrder: 'asc' },
      take: limit,
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

templatesRouter.put('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const { status } = statusSchema.parse(req.body);
    const template = await prisma.template.update({
      where: { id },
      data: { status },
    });
    res.json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update template status' });
  }
});

templatesRouter.post('/:id/duplicate', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const original = await prisma.template.findUnique({ where: { id } });
    if (!original) return res.status(404).json({ error: 'Template not found' });

    const dup = await prisma.template.create({
      data: {
        name: `${original.name} (Custom Copy)`,
        slug: `${original.slug}-copy`,
        category: original.category,
        thumbnail: original.thumbnail,
        description: original.description,
        previewImages: original.previewImages,
        isPremium: original.isPremium,
        displayOrder: original.displayOrder + 100,
        version: original.version,
      },
    });
    res.json(dup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }
    res.status(500).json({ error: 'Failed to duplicate template' });
  }
});
