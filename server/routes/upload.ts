import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import cloudinary from '../cloudinary';

export const uploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes: Record<string, string[]> = {
      IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
      VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
      VOICE_NOTE: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
    };
    const allAllowed = Object.values(allowedMimes).flat();
    if (allAllowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

function mimeToType(mime: string): 'IMAGE' | 'VIDEO' | 'VOICE_NOTE' {
  if (mime.startsWith('image/')) return 'IMAGE';
  if (mime.startsWith('video/')) return 'VIDEO';
  return 'VOICE_NOTE';
}

function extractPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+?)\.(?:jpg|jpeg|png|webp|avif|gif|mp4|webm|mov|mp3|wav|ogg)$/);
  return match ? match[1] : null;
}

uploadRouter.post('/', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const type = mimeToType(file.mimetype);
    const resourceType = type === 'VIDEO' ? 'video' : type === 'VOICE_NOTE' ? 'raw' : 'image';
    const folder = `memorygift/${type.toLowerCase()}s`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          transformation: type === 'IMAGE'
            ? [{ quality: 'auto', fetch_format: 'auto' }]
            : undefined,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const media = await prisma.mediaItem.create({
      data: {
        type,
        url: result.secure_url,
        name: req.body.name || file.originalname || 'Untitled',
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        mimeType: file.mimetype,
        publicId: result.public_id,
        uploadedBy: req.session.userName || 'Admin',
      },
    });

    res.json(media);
  } catch (error: any) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

uploadRouter.post('/replace/:id', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const existing = await prisma.mediaItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Media not found' });

    if (existing.publicId) {
      const resourceType = existing.type === 'VIDEO' ? 'video' : existing.type === 'VOICE_NOTE' ? 'raw' : 'image';
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: resourceType }).catch(() => {});
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No replacement file provided' });
    }

    const file = req.file;
    const type = mimeToType(file.mimetype);
    const resourceType = type === 'VIDEO' ? 'video' : type === 'VOICE_NOTE' ? 'raw' : 'image';
    const folder = `memorygift/${type.toLowerCase()}s`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const updated = await prisma.mediaItem.update({
      where: { id },
      data: {
        url: result.secure_url,
        name: req.body.name || file.originalname || existing.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        mimeType: file.mimetype,
        publicId: result.public_id,
      },
    });

    res.json(updated);
  } catch (error: any) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    res.status(500).json({ error: error.message || 'Replace failed' });
  }
});

uploadRouter.post('/signature', requireAuth, async (_req: Request, res: Response) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'memorygift/uploads';
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      cloudinary.config().api_secret!
    );
    res.json({
      timestamp,
      signature,
      cloudName: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key,
      folder,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Signature generation failed' });
  }
});
