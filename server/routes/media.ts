import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { destroyAsset } from '../cloudinary';

export const mediaRouter = Router();

function n(s: any) { return s.nullable().transform((v: any) => v === null ? undefined : v).optional(); }

const createMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'VOICE_NOTE']),
  url: z.string().min(1),
  name: z.string().min(1).max(300),
  size: n(z.string()).default('0 B'),
  mimeType: n(z.string()).default('application/octet-stream'),
  publicId: n(z.string()),
  uploadedBy: n(z.string()).default('Admin'),
});

mediaRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const media = await prisma.mediaItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

mediaRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createMediaSchema.parse(req.body);
    const media = await prisma.mediaItem.create({ data: parsed });
    res.json(media);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create media' });
  }
});

mediaRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const existing = await prisma.mediaItem.findUnique({ where: { id } });
    if (existing?.publicId) {
      await destroyAsset(existing.publicId, existing.type);
    }
    await prisma.mediaItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    res.status(500).json({ error: 'Failed to delete media' });
  }
});
