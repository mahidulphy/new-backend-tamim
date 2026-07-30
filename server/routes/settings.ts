import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const settingsRouter = Router();

function n(s: any) { return s.nullable().transform((v: any) => v === null ? undefined : v).optional(); }

const updateSettingsSchema = z.object({
  siteName: n(z.string().min(1).max(200)),
  siteLogo: n(z.string()),
  favicon: n(z.string()),
  primaryColor: n(z.string()),
  secondaryColor: n(z.string()),
  supportEmail: n(z.string().email()),
  phone: n(z.string()),
  address: n(z.string()),
  city: n(z.string()),
  facebook: n(z.string()),
  instagram: n(z.string()),
  youtube: n(z.string()),
  twitter: n(z.string()),
  linkedin: n(z.string()),
  tiktok: n(z.string()),
  whatsapp: n(z.string()),
  metaTitle: n(z.string().max(200)),
  metaDescription: n(z.string().max(500)),
  ogImage: n(z.string()),
  twitterHandle: n(z.string()),
  maintenanceMode: n(z.boolean()),
});

settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

settingsRouter.put('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = updateSettingsSchema.parse(req.body);
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: parsed });
    } else {
      settings = await prisma.siteSettings.create({ data: parsed });
    }
    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update settings' });
  }
});
