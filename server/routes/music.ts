import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import cloudinary from '../cloudinary';

export const musicRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const audioMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/flac', 'audio/x-m4a', 'audio/mp4', 'audio/m4a'];
    if (audioMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
      err.message = `Unsupported audio type: ${file.mimetype}`;
      cb(err);
    }
  },
});

const musicSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  category: z.string().min(1).max(100).default('General'),
  duration: z.string().max(20).optional().default('00:00'),
  thumbnail: z.string().url().nullable().transform(v => v === null ? undefined : v).optional(),
});

const updateSchema = musicSchema.partial();

function formatDuration(seconds?: number | null): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

musicRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const music = await prisma.backgroundMusic.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
    res.json(music);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch music' });
  }
});

musicRouter.post('/upload', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const parsed = musicSchema.parse(req.body);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'memorygift/music',
          use_filename: true,
          unique_filename: true,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    const music = await prisma.backgroundMusic.create({
      data: {
        title: parsed.title,
        artist: parsed.artist,
        musicUrl: result.secure_url,
        category: parsed.category,
        duration: parsed.duration !== '00:00' ? parsed.duration : formatDuration(result.duration),
        thumbnail: parsed.thumbnail,
        publicId: result.public_id,
      },
    });

    res.status(201).json(music);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: error.message || 'Music upload failed' });
  }
});

musicRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ ...musicSchema.shape, musicUrl: z.string().url() }).parse(req.body);

    const music = await prisma.backgroundMusic.create({
      data: {
        title: parsed.title,
        artist: parsed.artist,
        musicUrl: parsed.musicUrl,
        category: parsed.category,
        duration: parsed.duration,
        thumbnail: parsed.thumbnail,
      },
    });

    res.status(201).json(music);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: error.message || 'Failed to create music' });
  }
});

musicRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const parsed = updateSchema.parse(req.body);

    const music = await prisma.backgroundMusic.update({
      where: { id },
      data: parsed,
    });

    res.json(music);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: error.message || 'Failed to update music' });
  }
});

musicRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const existing = await prisma.backgroundMusic.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Music not found' });
    }

    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'video' }).catch(() => {});
    }

    await prisma.backgroundMusic.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid music ID' });
    }
    res.status(500).json({ error: error.message || 'Failed to delete music' });
  }
});
