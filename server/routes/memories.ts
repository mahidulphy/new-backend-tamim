import { randomUUID, timingSafeEqual } from 'crypto';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const memoriesRouter = Router();

function nullsafeStr(def = ''): any {
  return z.string().nullable().transform(v => v === null ? undefined : v).optional().default(def);
}

function nullsafeEnum(values: readonly [string, ...string[]], def: string): any {
  return (z.enum(values) as any).nullable().transform((v: any) => v === null ? undefined : v).optional().default(def);
}

function nullsafeNum(def: number): any {
  return z.number().int().min(0).nullable().transform(v => v === null ? undefined : v).optional().default(def);
}

function nullsafeObj<T extends z.ZodRawShape>(shape: T): any {
  return z.object(shape).nullable().transform(v => v === null ? undefined : v).optional();
}

function nullsafeArr<T extends z.ZodTypeAny>(schema: T): any {
  return z.array(schema).nullable().transform(v => v === null ? undefined : v).optional();
}

const letterSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(200).nullable().transform(v => v === null ? undefined : v).optional().default('My Dearest,'),
  content: nullsafeStr(),
  fontStyle: nullsafeEnum(['serif', 'sans', 'handwriting', 'display'] as const, 'serif'),
  textAlignment: nullsafeEnum(['left', 'center', 'right', 'justify'] as const, 'left'),
});

const photoSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  caption: nullsafeStr(),
  displayOrder: nullsafeNum(0),
});

const videoSchema = z.object({
  id: z.string().optional(),
  videoUrl: z.string().min(1),
  thumbnail: nullsafeStr(),
  caption: nullsafeStr(),
  displayOrder: nullsafeNum(0),
});

const voiceNoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  audioUrl: z.string().min(1),
  duration: nullsafeStr('00:30'),
  displayOrder: nullsafeNum(0),
});

const timelineEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: nullsafeStr(),
  eventDate: nullsafeStr(),
  image: nullsafeStr(),
  displayOrder: nullsafeNum(0),
});

const quoteSchema = z.object({
  id: z.string().optional(),
  quote: z.string().min(1),
  author: nullsafeStr(),
  displayOrder: nullsafeNum(0),
});

const wishSchema = z.object({
  id: z.string().optional(),
  personName: z.string().min(1),
  message: z.string().min(1),
});

const createMemorySchema = z.object({
  title: z.string().min(1).max(300),
  subtitle: nullsafeStr(),
  recipientName: z.string().min(1).max(200),
  senderName: z.string().min(1).max(200),
  relationship: nullsafeStr('Loved One'),
  coverImage: nullsafeStr(),
  coverVideo: nullsafeStr(),
  templateId: z.string().min(1),
  musicId: nullsafeStr(),
  status: nullsafeEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const, 'DRAFT'),
  visibility: nullsafeEnum(['PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED'] as const, 'PUBLIC'),
  accessPassword: nullsafeStr(),
  letter: letterSchema.nullable().transform(v => v === null ? undefined : v).optional(),
  photos: nullsafeArr(photoSchema).default([]),
  videos: nullsafeArr(videoSchema).default([]),
  voiceNotes: nullsafeArr(voiceNoteSchema).default([]),
  timeline: nullsafeArr(timelineEventSchema).default([]),
  quotes: nullsafeArr(quoteSchema).default([]),
  wishes: nullsafeArr(wishSchema).default([]),
});

const updateLetterSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(200).nullable().transform(v => v === null ? undefined : v).optional(),
  content: nullsafeStr(),
  fontStyle: z.enum(['serif', 'sans', 'handwriting', 'display']).nullable().transform(v => v === null ? undefined : v).optional(),
  textAlignment: z.enum(['left', 'center', 'right', 'justify']).nullable().transform(v => v === null ? undefined : v).optional(),
});

const updateMemorySchema = z.object({
  title: z.string().min(1).max(300).nullable().transform(v => v === null ? undefined : v).optional(),
  subtitle: nullsafeStr(),
  recipientName: z.string().min(1).max(200).nullable().transform(v => v === null ? undefined : v).optional(),
  senderName: z.string().min(1).max(200).nullable().transform(v => v === null ? undefined : v).optional(),
  relationship: nullsafeStr(),
  coverImage: nullsafeStr(),
  coverVideo: nullsafeStr(),
  templateId: z.string().min(1).nullable().transform(v => v === null ? undefined : v).optional(),
  musicId: nullsafeStr(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).nullable().transform(v => v === null ? undefined : v).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED']).nullable().transform(v => v === null ? undefined : v).optional(),
  accessPassword: nullsafeStr(),
  letter: updateLetterSchema.nullable().transform(v => v === null ? undefined : v).optional(),
  photos: nullsafeArr(photoSchema),
  videos: nullsafeArr(videoSchema),
  voiceNotes: nullsafeArr(voiceNoteSchema),
  timeline: nullsafeArr(timelineEventSchema),
  quotes: nullsafeArr(quoteSchema),
  wishes: nullsafeArr(wishSchema),
});

const statusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

const idParam = z.string().min(1);
const slugParam = z.string().min(1);

function generateSlug(): string {
  return randomUUID();
}

const memoryListSelect = {
  id: true, slug: true, title: true, subtitle: true, recipientName: true,
  senderName: true, relationship: true, coverImage: true, coverVideo: true,
  templateId: true, musicId: true, status: true, visibility: true,
  accessPassword: true, viewCount: true, publishedAt: true, createdAt: true, updatedAt: true,
} as const;

const memoryInclude = {
  letter: true,
  photos: { orderBy: { displayOrder: 'asc' as const } },
  videos: { orderBy: { displayOrder: 'asc' as const } },
  voiceNotes: { orderBy: { displayOrder: 'asc' as const } },
  timeline: { orderBy: { displayOrder: 'asc' as const } },
  quotes: { orderBy: { displayOrder: 'asc' as const } },
  wishes: { orderBy: { createdAt: 'desc' as const } },
};

memoriesRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        select: memoryListSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.memory.count(),
    ]);
    res.json({ data: memories, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

memoriesRouter.get('/list-full', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        include: memoryInclude,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.memory.count(),
    ]);
    res.json({ data: memories, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

memoriesRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = idParam.parse(req.params.id);
    const memory = await prisma.memory.findUnique({
      where: { id },
      include: memoryInclude,
    });
    if (!memory) return res.status(404).json({ error: 'Memory not found' });
    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid memory ID' });
    }
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

memoriesRouter.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const slug = slugParam.parse(req.params.slug);
    const memory = await prisma.memory.findFirst({
      where: { slug, status: 'PUBLISHED', visibility: { in: ['PUBLIC', 'PASSWORD_PROTECTED'] } },
      include: memoryInclude,
    });
    if (!memory) return res.status(404).json({ error: 'Memory not found' });

    if (memory.visibility === 'PASSWORD_PROTECTED' && memory.accessPassword) {
      const { accessPassword, letter, photos, videos, voiceNotes, timeline, quotes, wishes, ...publicInfo } = memory;
      return res.json({
        ...publicInfo,
        requiresPassword: true,
        letter: undefined,
        photos: [],
        videos: [],
        voiceNotes: [],
        timeline: [],
        quotes: [],
        wishes: [],
      });
    }

    const { accessPassword, ...safe } = memory;
    res.json(safe);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid slug' });
    }
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

memoriesRouter.post('/slug/:slug/verify', async (req: Request, res: Response) => {
  try {
    const slug = slugParam.parse(req.params.slug);
    const { password } = z.object({ password: z.string().min(1).max(200) }).parse(req.body);

    const memory = await prisma.memory.findFirst({
      where: { slug, status: 'PUBLISHED', visibility: 'PASSWORD_PROTECTED' },
      include: memoryInclude,
    });
    if (!memory || !memory.accessPassword) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const provided = Buffer.from(password);
    const stored = Buffer.from(memory.accessPassword);
    const ok = provided.length === stored.length && timingSafeEqual(provided, stored);
    if (!ok) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const { accessPassword, ...safe } = memory;
    res.json(safe);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    console.error('Verify memory password error:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

memoriesRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createMemorySchema.parse(req.body);
    const slug = generateSlug();

    const memory = await prisma.$transaction(async (tx) => {
      return tx.memory.create({
        data: {
          title: parsed.title,
          subtitle: parsed.subtitle || '',
          slug,
          recipientName: parsed.recipientName,
          senderName: parsed.senderName,
          relationship: parsed.relationship || 'Loved One',
          coverImage: parsed.coverImage || '',
          coverVideo: parsed.coverVideo || '',
          templateId: parsed.templateId,
          musicId: parsed.musicId || undefined,
          status: parsed.status || 'DRAFT',
          publishedAt: parsed.status === 'PUBLISHED' ? new Date() : null,
          visibility: parsed.visibility || 'PUBLIC',
          accessPassword: parsed.visibility === 'PASSWORD_PROTECTED' ? (parsed.accessPassword || null) : null,
          letter: parsed.letter ? {
            create: {
              title: parsed.letter.title || 'My Dearest,',
              content: parsed.letter.content,
              fontStyle: parsed.letter.fontStyle || 'serif',
              textAlignment: parsed.letter.textAlignment || 'left',
            },
          } : undefined,
          photos: {
            create: (parsed.photos || []).map((p: any) => ({
              imageUrl: p.imageUrl,
              caption: p.caption || '',
              displayOrder: p.displayOrder || 0,
            })),
          },
          videos: {
            create: (parsed.videos || []).map((v: any) => ({
              videoUrl: v.videoUrl,
              thumbnail: v.thumbnail || '',
              caption: v.caption || '',
              displayOrder: v.displayOrder || 0,
            })),
          },
          voiceNotes: {
            create: (parsed.voiceNotes || []).map((vn: any) => ({
              title: vn.title,
              audioUrl: vn.audioUrl,
              duration: vn.duration || '00:30',
              displayOrder: vn.displayOrder || 0,
            })),
          },
          timeline: {
            create: (parsed.timeline || []).map((t: any) => ({
              title: t.title,
              description: t.description || '',
              eventDate: t.eventDate || '',
              image: t.image || '',
              displayOrder: t.displayOrder || 0,
            })),
          },
          quotes: {
            create: (parsed.quotes || []).map((q: any) => ({
              quote: q.quote,
              author: q.author || '',
              displayOrder: q.displayOrder || 0,
            })),
          },
          wishes: {
            create: (parsed.wishes || []).map((w: any) => ({
              personName: w.personName,
              message: w.message,
            })),
          },
        },
        include: memoryInclude,
      });
    });

    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Create memory error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create memory' });
  }
});

memoriesRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = idParam.parse(req.params.id);
    const parsed = updateMemorySchema.parse(req.body);

    const memory = await prisma.$transaction(async (tx) => {
      return tx.memory.update({
        where: { id },
        data: {
          ...(parsed.title !== undefined && { title: parsed.title }),
          ...(parsed.subtitle !== undefined && { subtitle: parsed.subtitle }),
          ...(parsed.recipientName !== undefined && { recipientName: parsed.recipientName }),
          ...(parsed.senderName !== undefined && { senderName: parsed.senderName }),
          ...(parsed.relationship !== undefined && { relationship: parsed.relationship }),
          ...(parsed.coverImage !== undefined && { coverImage: parsed.coverImage }),
          ...(parsed.coverVideo !== undefined && { coverVideo: parsed.coverVideo }),
          ...(parsed.templateId !== undefined && { templateId: parsed.templateId }),
          ...(parsed.musicId !== undefined && { musicId: parsed.musicId }),
          ...(parsed.status !== undefined && { status: parsed.status }),
          ...(parsed.status !== undefined && { publishedAt: parsed.status === 'PUBLISHED' ? new Date() : null }),
          ...(parsed.visibility !== undefined && { visibility: parsed.visibility }),
          ...(parsed.accessPassword !== undefined && { accessPassword: parsed.visibility === 'PASSWORD_PROTECTED' ? (parsed.accessPassword || null) : null }),
          letter: parsed.letter !== undefined ? {
            upsert: {
              create: {
                title: parsed.letter.title || 'My Dearest,',
                content: parsed.letter.content || '',
                fontStyle: parsed.letter.fontStyle || 'serif',
                textAlignment: parsed.letter.textAlignment || 'left',
              },
              update: {
                ...(parsed.letter.title !== undefined && { title: parsed.letter.title }),
                ...(parsed.letter.content !== undefined && { content: parsed.letter.content }),
                ...(parsed.letter.fontStyle !== undefined && { fontStyle: parsed.letter.fontStyle }),
                ...(parsed.letter.textAlignment !== undefined && { textAlignment: parsed.letter.textAlignment }),
              },
            },
          } : undefined,
          photos: parsed.photos !== undefined ? {
            deleteMany: {},
            create: parsed.photos.map((p: any) => ({
              imageUrl: p.imageUrl,
              caption: p.caption || '',
              displayOrder: p.displayOrder || 0,
            })),
          } : undefined,
          videos: parsed.videos !== undefined ? {
            deleteMany: {},
            create: parsed.videos.map((v: any) => ({
              videoUrl: v.videoUrl,
              thumbnail: v.thumbnail || '',
              caption: v.caption || '',
              displayOrder: v.displayOrder || 0,
            })),
          } : undefined,
          voiceNotes: parsed.voiceNotes !== undefined ? {
            deleteMany: {},
            create: parsed.voiceNotes.map((vn: any) => ({
              title: vn.title,
              audioUrl: vn.audioUrl,
              duration: vn.duration || '00:30',
              displayOrder: vn.displayOrder || 0,
            })),
          } : undefined,
          timeline: parsed.timeline !== undefined ? {
            deleteMany: {},
            create: parsed.timeline.map((t: any) => ({
              title: t.title,
              description: t.description || '',
              eventDate: t.eventDate || '',
              image: t.image || '',
              displayOrder: t.displayOrder || 0,
            })),
          } : undefined,
          quotes: parsed.quotes !== undefined ? {
            deleteMany: {},
            create: parsed.quotes.map((q: any) => ({
              quote: q.quote,
              author: q.author || '',
              displayOrder: q.displayOrder || 0,
            })),
          } : undefined,
          wishes: parsed.wishes !== undefined ? {
            deleteMany: {},
            create: parsed.wishes.map((w: any) => ({
              personName: w.personName,
              message: w.message,
            })),
          } : undefined,
        },
        include: memoryInclude,
      });
    });

    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Update memory error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to update memory' });
  }
});

memoriesRouter.put('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = idParam.parse(req.params.id);
    const { status } = statusSchema.parse(req.body);
    const memory = await prisma.memory.update({
      where: { id },
      data: { status },
      select: memoryListSelect,
    });
    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update memory status' });
  }
});

memoriesRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    await prisma.memory.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid memory ID' });
    }
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

memoriesRouter.put('/:id/duplicate', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);

    const original = await prisma.memory.findUnique({
      where: { id },
      include: memoryInclude,
    });
    if (!original) return res.status(404).json({ error: 'Memory not found' });

    const newSlug = generateSlug();

    const duplicated = await prisma.$transaction(async (tx) => {
      return tx.memory.create({
        data: {
          slug: newSlug,
          title: `${original.title} (Copy)`,
          subtitle: original.subtitle,
          recipientName: original.recipientName,
          senderName: original.senderName,
          relationship: original.relationship,
          coverImage: original.coverImage,
          coverVideo: original.coverVideo || undefined,
          templateId: original.templateId,
          musicId: original.musicId || undefined,
          status: 'DRAFT',
          visibility: original.visibility,
          accessPassword: original.visibility === 'PASSWORD_PROTECTED' ? original.accessPassword : null,
          letter: original.letter ? {
            create: {
              title: original.letter.title,
              content: original.letter.content,
              fontStyle: original.letter.fontStyle,
              textAlignment: original.letter.textAlignment,
            },
          } : undefined,
          photos: {
            create: original.photos.map(p => ({
              imageUrl: p.imageUrl,
              caption: p.caption || '',
              displayOrder: p.displayOrder,
            })),
          },
          videos: {
            create: original.videos.map(v => ({
              videoUrl: v.videoUrl,
              thumbnail: v.thumbnail || '',
              caption: v.caption || '',
              displayOrder: v.displayOrder,
            })),
          },
          voiceNotes: {
            create: original.voiceNotes.map(vn => ({
              title: vn.title,
              audioUrl: vn.audioUrl,
              duration: vn.duration,
              displayOrder: vn.displayOrder,
            })),
          },
          timeline: {
            create: original.timeline.map(t => ({
              title: t.title,
              description: t.description || '',
              eventDate: t.eventDate,
              image: t.image || '',
              displayOrder: t.displayOrder,
            })),
          },
          quotes: {
            create: original.quotes.map(q => ({
              quote: q.quote,
              author: q.author || '',
              displayOrder: q.displayOrder,
            })),
          },
          wishes: {
            create: original.wishes.map(w => ({
              personName: w.personName,
              message: w.message,
            })),
          },
        },
        include: memoryInclude,
      });
    });

    res.json(duplicated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    console.error('Duplicate memory error:', error);
    res.status(500).json({ error: 'Failed to duplicate memory' });
  }
});

memoriesRouter.put('/:id/increment-view', async (req: Request, res: Response) => {
  try {
    const id = idParam.parse(req.params.id);
    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const deviceType = ua.includes('mobile') || ua.includes('android') ? 'mobile' : ua.includes('tablet') || ua.includes('ipad') ? 'tablet' : 'desktop';
    let browser = 'Unknown';
    if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edg')) browser = 'Edge';
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

    const [memory] = await Promise.all([
      prisma.memory.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: memoryListSelect,
      }),
      prisma.memoryViewEvent.create({
        data: {
          memoryId: id,
          deviceType,
          browser,
          referrer: req.headers['referer'] || '',
          ipAddress: req.ip || req.socket.remoteAddress || '',
        },
      }),
    ]);
    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid memory ID' });
    }
    res.status(500).json({ error: 'Failed to increment view' });
  }
});
