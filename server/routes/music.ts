import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const musicRouter = Router();

musicRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const music = await prisma.backgroundMusic.findMany({ take: 100 });
    res.json(music);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch music' });
  }
});
