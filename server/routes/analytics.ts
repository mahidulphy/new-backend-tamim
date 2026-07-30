import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const analyticsRouter = Router();

analyticsRouter.post('/track-view', async (req: Request, res: Response) => {
  try {
    const n = (s: any) => s.nullable().transform((v: any) => v === null ? undefined : v).optional();
    const schema = z.object({
      memoryId: z.string().min(1),
      deviceType: n(z.string()).default('desktop'),
      browser: n(z.string()).default(''),
      referrer: n(z.string()).default(''),
    });
    const { memoryId, deviceType, browser, referrer } = schema.parse(req.body);

    const [memory] = await Promise.all([
      prisma.memory.update({
        where: { id: memoryId },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.memoryViewEvent.create({
        data: {
          memoryId,
          deviceType,
          browser,
          referrer,
          ipAddress: req.ip || req.socket.remoteAddress || '',
        },
      }),
    ]);
    res.json(memory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to track view' });
  }
});

analyticsRouter.get('/summary', requireAuth, async (_req: Request, res: Response) => {
  try {
    const [memoryStats, qrStats, templateStats, recentActivity, viewStats, downloadStats, scanTimeline] = await Promise.all([
      prisma.memory.aggregate({ _sum: { viewCount: true }, _count: true }),
      prisma.qRCodeData.aggregate({ _sum: { scanCount: true, downloadCount: true }, _count: true }),
      prisma.template.findMany({
        include: { _count: { select: { memories: true } } },
        orderBy: { memories: { _count: 'desc' } },
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { admin: { select: { name: true, avatar: true } } },
      }),
      prisma.memory.findMany({
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: { id: true, title: true, recipientName: true, viewCount: true, slug: true },
      }),
      prisma.qRCodeData.findMany({
        orderBy: { downloadCount: 'desc' },
        take: 10,
        select: { id: true, downloadCount: true, memoryId: true },
      }),
      prisma.qRScanEvent.groupBy({
        by: ['createdAt'],
        _count: true,
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);

    const totalMemoryViews = memoryStats._sum.viewCount || 0;
    const totalQRScans = qrStats._sum.scanCount || 0;
    const totalQRDownloads = qrStats._sum.downloadCount || 0;

    res.json({
      totals: {
        totalMemories: memoryStats._count,
        totalMemoryViews,
        totalQRScans,
        totalQRDownloads,
        totalQRCodes: qrStats._count,
      },
      mostViewedMemories: viewStats,
      mostDownloadedQRCodes: downloadStats,
      popularTemplates: templateStats.map(t => ({
        id: t.id,
        name: t.name,
        memoryCount: t._count.memories,
      })),
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        adminName: a.admin.name,
        adminAvatar: a.admin.avatar,
        action: a.action,
        target: a.target,
        description: a.description,
        createdAt: a.createdAt,
      })),
      scanTimeline,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

analyticsRouter.get('/timeline', requireAuth, async (req: Request, res: Response) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days as string) || 30, 1), 365);
    const period = req.query.period as string || 'day';

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [views, scans] = await Promise.all([
      prisma.memoryViewEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      prisma.qRScanEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
    ]);

    const dayMap: Record<string, { views: number; scans: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      let key: string;
      if (period === 'week') {
        const weekStart = new Date(d);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().slice(0, 10);
      } else if (period === 'month') {
        key = d.toISOString().slice(0, 7);
      } else {
        key = d.toISOString().slice(0, 10);
      }
      if (!dayMap[key]) dayMap[key] = { views: 0, scans: 0 };
    }

    views.forEach(v => {
      let key: string;
      if (period === 'week') {
        const d = new Date(v.createdAt);
        d.setDate(d.getDate() - d.getDay());
        key = d.toISOString().slice(0, 10);
      } else if (period === 'month') {
        key = v.createdAt.toISOString().slice(0, 7);
      } else {
        key = v.createdAt.toISOString().slice(0, 10);
      }
      if (dayMap[key]) dayMap[key].views++;
    });

    scans.forEach(s => {
      let key: string;
      if (period === 'week') {
        const d = new Date(s.createdAt);
        d.setDate(d.getDate() - d.getDay());
        key = d.toISOString().slice(0, 10);
      } else if (period === 'month') {
        key = s.createdAt.toISOString().slice(0, 7);
      } else {
        key = s.createdAt.toISOString().slice(0, 10);
      }
      if (dayMap[key]) dayMap[key].scans++;
    });

    const timeline = Object.entries(dayMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

analyticsRouter.get('/devices', requireAuth, async (_req: Request, res: Response) => {
  try {
    const devices = await prisma.memoryViewEvent.groupBy({
      by: ['deviceType'],
      _count: true,
      orderBy: { _count: { deviceType: 'desc' } },
    });
    res.json(devices.map(d => ({ deviceType: d.deviceType, count: d._count })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device stats' });
  }
});

analyticsRouter.get('/browsers', requireAuth, async (_req: Request, res: Response) => {
  try {
    const browsers = await prisma.memoryViewEvent.groupBy({
      by: ['browser'],
      _count: true,
      orderBy: { _count: { browser: 'desc' } },
      take: 15,
    });
    res.json(browsers.map(b => ({ browser: b.browser || 'Unknown', count: b._count })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch browser stats' });
  }
});

analyticsRouter.get('/referrers', requireAuth, async (_req: Request, res: Response) => {
  try {
    const referrers = await prisma.memoryViewEvent.groupBy({
      by: ['referrer'],
      _count: true,
      orderBy: { _count: { referrer: 'desc' } },
      take: 15,
    });
    res.json(referrers.map(r => ({ referrer: r.referrer || 'Direct', count: r._count })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrer stats' });
  }
});

analyticsRouter.get('/recent', requireAuth, async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const [activityLogs, recentViews, recentScans] = await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { admin: { select: { name: true, avatar: true } } },
      }),
      prisma.memoryViewEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { memory: { select: { title: true, recipientName: true } } },
      }),
      prisma.qRScanEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { qr: { select: { memoryId: true } } },
      }),
    ]);

    const activity: any[] = [];

    activityLogs.forEach(a => {
      activity.push({
        type: 'admin',
        icon: 'activity',
        description: a.description,
        adminName: a.admin.name,
        createdAt: a.createdAt,
      });
    });

    recentViews.forEach(v => {
      activity.push({
        type: 'view',
        icon: 'eye',
        description: `Memory viewed: ${v.memory.title}`,
        detail: v.memory.recipientName,
        browser: v.browser,
        deviceType: v.deviceType,
        createdAt: v.createdAt,
      });
    });

    recentScans.forEach(s => {
      activity.push({
        type: 'scan',
        icon: 'qrcode',
        description: 'QR code scanned',
        browser: s.userAgent,
        createdAt: s.createdAt,
      });
    });

    activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    activity.splice(limit);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});
