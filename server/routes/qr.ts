import { Router, Request, Response } from 'express';
import { z } from 'zod';
import QRCode from 'qrcode';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const qrRouter = Router();

function n(s: any) { return s.nullable().transform((v: any) => v === null ? undefined : v).optional(); }

const createQRSchema = z.object({
  memoryId: z.string().min(1),
  qrValue: z.string().min(1),
  foregroundColor: n(z.string()).default('#000000'),
  backgroundColor: n(z.string()).default('#FFFFFF'),
  logoUrl: n(z.string()),
  style: (z.enum(['standard', 'rounded', 'dots']) as any).nullable().transform((v: any) => v === null ? undefined : v).optional().default('standard'),
});

const customizeSchema = z.object({
  foregroundColor: n(z.string()),
  backgroundColor: n(z.string()),
  logoUrl: z.string().optional().nullable(),
  style: (z.enum(['standard', 'rounded', 'dots']) as any).nullable().transform((v: any) => v === null ? undefined : v).optional(),
});

qrRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;
    const [qrs, total] = await Promise.all([
      prisma.qRCodeData.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: { _count: { select: { scanLogs: true } } },
      }),
      prisma.qRCodeData.count(),
    ]);
    const data = qrs.map(qr => ({
      ...qr,
      totalScans: qr._count.scanLogs,
      _count: undefined,
    }));
    res.json({ data, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

qrRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { memoryId, qrValue, foregroundColor, backgroundColor, logoUrl, style } = createQRSchema.parse(req.body);

    const qrCodeImage = await QRCode.toDataURL(qrValue, {
      color: { dark: foregroundColor, light: backgroundColor },
      width: 400,
      margin: 2,
    });

    const existing = await prisma.qRCodeData.findUnique({ where: { memoryId } });
    if (existing) {
      const updated = await prisma.qRCodeData.update({
        where: { memoryId },
        data: { qrValue, qrCodeImage, foregroundColor, backgroundColor, logoUrl, style },
      });
      return res.json(updated);
    }
    const qr = await prisma.qRCodeData.create({
      data: { memoryId, qrValue, qrCodeImage, foregroundColor, backgroundColor, logoUrl, style },
    });
    res.json(qr);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('QR creation error:', error);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
});

qrRouter.put('/:id/scan', async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const [qr] = await Promise.all([
      prisma.qRCodeData.update({
        where: { id },
        data: { scanCount: { increment: 1 }, lastScannedAt: new Date() },
      }),
      prisma.qRScanEvent.create({
        data: {
          qrId: id,
          ipAddress: req.ip || req.socket.remoteAddress || '',
          userAgent: req.headers['user-agent'] || '',
          referrer: req.headers['referer'] || '',
        },
      }),
    ]);
    res.json(qr);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid QR ID' });
    }
    res.status(500).json({ error: 'Failed to increment scan' });
  }
});

qrRouter.put('/:id/customize', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const parsed = customizeSchema.parse(req.body);

    const existing = await prisma.qRCodeData.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'QR code not found' });

    const fg = parsed.foregroundColor || existing.foregroundColor;
    const bg = parsed.backgroundColor || existing.backgroundColor;
    const st = parsed.style || existing.style;

    const qrCodeImage = await QRCode.toDataURL(existing.qrValue, {
      color: { dark: fg, light: bg },
      width: 400,
      margin: 2,
    });

    const updated = await prisma.qRCodeData.update({
      where: { id },
      data: {
        ...(parsed.foregroundColor && { foregroundColor: parsed.foregroundColor }),
        ...(parsed.backgroundColor && { backgroundColor: parsed.backgroundColor }),
        ...(parsed.logoUrl !== undefined && { logoUrl: parsed.logoUrl }),
        ...(parsed.style && { style: parsed.style }),
        qrCodeImage,
      },
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to customize QR code' });
  }
});

qrRouter.get('/:id/download', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const qr = await prisma.qRCodeData.findUnique({ where: { id } });
    if (!qr) return res.status(404).json({ error: 'QR code not found' });

    const format = req.query.format as string || 'png';
    const width = Math.min(Math.max(parseInt(req.query.width as string) || 400, 200), 2000);

    await Promise.all([
      prisma.qRCodeData.update({ where: { id }, data: { downloadCount: { increment: 1 } } }),
      prisma.qRDownloadEvent.create({
        data: { qrId: id, format, ipAddress: req.ip || req.socket.remoteAddress || '' },
      }),
    ]);

    if (format === 'svg') {
      const svg = await QRCode.toString(qr.qrValue, { type: 'svg', width, margin: 2, color: { dark: qr.foregroundColor, light: qr.backgroundColor } });
      res.set('Content-Type', 'image/svg+xml');
      res.set('Content-Disposition', `attachment; filename="qrcode-${qr.id}.svg"`);
      return res.send(svg);
    }

    const buffer = await QRCode.toBuffer(qr.qrValue, { type: 'png', width, margin: 2, color: { dark: qr.foregroundColor, light: qr.backgroundColor } });
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="qrcode-${qr.id}.png"`);
    res.send(buffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid QR ID' });
    }
    res.status(500).json({ error: 'Failed to download QR code' });
  }
});

qrRouter.get('/:id/analytics', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const days = Math.min(Math.max(parseInt(req.query.days as string) || 30, 1), 365);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const qr = await prisma.qRCodeData.findUnique({ where: { id } });
    if (!qr) return res.status(404).json({ error: 'QR code not found' });

    const timeline = await prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
      `SELECT DATE(created_at) as date, COUNT(*)::int as count FROM "QRScanEvent" WHERE "qrId" = $1 AND created_at >= $2 GROUP BY DATE(created_at) ORDER BY date ASC`,
      id, since
    );

    const recentLogs = await prisma.qRScanEvent.findMany({
      where: { qrId: id, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { userAgent: true, referrer: true },
    });

    res.json({
      qr,
      totalScans: qr.scanCount,
      timeline: timeline.map(t => ({ date: t.date, count: Number(t.count) })),
      recentBrowsers: [...new Set(recentLogs.map(l => l.userAgent))].slice(0, 10),
      recentReferrers: [...new Set(recentLogs.map(l => l.referrer).filter(Boolean))].slice(0, 10),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid QR ID' });
    }
    res.status(500).json({ error: 'Failed to fetch QR analytics' });
  }
});

qrRouter.post('/bulk', requireAuth, async (req: Request, res: Response) => {
  try {
    const bulkSchema = z.object({
      memoryIds: z.array(z.string().min(1)).min(1).max(50),
      foregroundColor: n(z.string()).default('#000000'),
      backgroundColor: n(z.string()).default('#FFFFFF'),
      style: (z.enum(['standard', 'rounded', 'dots']) as any).nullable().transform((v: any) => v === null ? undefined : v).optional().default('standard'),
    });
    const { memoryIds, foregroundColor, backgroundColor, style } = bulkSchema.parse(req.body);

    const baseUrl = process.env.CLIENT_ORIGIN || 'https://memorygift.com';
    const memories = await prisma.memory.findMany({
      where: { id: { in: memoryIds } },
      select: { id: true, slug: true, title: true },
    });

    const results = await prisma.$transaction(async (tx) => {
      const generated: any[] = [];
      for (const memory of memories) {
        const qrValue = `${baseUrl}/#/memory/${memory.slug}`;
        const qrCodeImage = await QRCode.toDataURL(qrValue, {
          color: { dark: foregroundColor, light: backgroundColor },
          width: 400,
          margin: 2,
        });

        const existing = await tx.qRCodeData.findUnique({ where: { memoryId: memory.id } });
        if (existing) {
          const updated = await tx.qRCodeData.update({
            where: { memoryId: memory.id },
            data: { qrValue, qrCodeImage, foregroundColor, backgroundColor, style },
          });
          generated.push(updated);
        } else {
          const created = await tx.qRCodeData.create({
            data: { memoryId: memory.id, qrValue, qrCodeImage, foregroundColor, backgroundColor, style },
          });
          generated.push(created);
        }
      }
      return generated;
    });

    res.json({ generated: results.length, data: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to bulk generate QR codes' });
  }
});
