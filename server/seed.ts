import { prisma } from './db';
import bcrypt from 'bcrypt';
import { INITIAL_USER, INITIAL_TEMPLATES, INITIAL_MUSIC, INITIAL_MEMORIES, INITIAL_ORDERS, INITIAL_QRS, INITIAL_MEDIA, INITIAL_SETTINGS, INITIAL_LOGS } from '../src/constants/initialData';

async function main() {
  console.log('Seeding database...');

  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      ...INITIAL_USER,
      passwordHash,
    },
  });

  for (const tmpl of INITIAL_TEMPLATES) {
    await prisma.template.create({
      data: {
        ...tmpl,
        previewImages: tmpl.previewImages || [],
      },
    });
  }

  for (const m of INITIAL_MUSIC) {
    await prisma.backgroundMusic.create({ data: m });
  }

  for (const mem of INITIAL_MEMORIES) {
    const { letter, photos, videos, voiceNotes, timeline, quotes, wishes, ...memData } = mem;
    await prisma.memory.create({
      data: {
        ...memData,
        publishedAt: memData.publishedAt ? new Date(memData.publishedAt) : null,
        createdAt: new Date(memData.createdAt),
        updatedAt: new Date(memData.updatedAt),
        letter: letter ? {
          create: {
            id: letter.id,
            title: letter.title,
            content: letter.content,
            fontStyle: letter.fontStyle || 'serif',
            textAlignment: letter.textAlignment || 'left',
          },
        } : undefined,
        photos: {
          create: photos.map(p => ({
            id: p.id,
            imageUrl: p.imageUrl,
            caption: p.caption || '',
            displayOrder: p.displayOrder,
          })),
        },
        videos: {
          create: videos.map(v => ({
            id: v.id,
            videoUrl: v.videoUrl,
            thumbnail: v.thumbnail || '',
            caption: v.caption || '',
            displayOrder: v.displayOrder,
          })),
        },
        voiceNotes: {
          create: voiceNotes.map(vn => ({
            id: vn.id,
            title: vn.title,
            audioUrl: vn.audioUrl,
            duration: vn.duration,
            displayOrder: vn.displayOrder,
          })),
        },
        timeline: {
          create: timeline.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            eventDate: t.eventDate,
            image: t.image || '',
            displayOrder: t.displayOrder,
          })),
        },
        quotes: {
          create: quotes.map(q => ({
            id: q.id,
            quote: q.quote,
            author: q.author,
            displayOrder: q.displayOrder,
          })),
        },
        wishes: {
          create: wishes.map(w => ({
            id: w.id,
            personName: w.personName,
            message: w.message,
            createdAt: new Date(w.createdAt),
          })),
        },
      },
    });
  }

  for (const o of INITIAL_ORDERS) {
    await prisma.order.create({
      data: {
        ...o,
        createdAt: new Date(o.createdAt),
      },
    });
  }

  for (const q of INITIAL_QRS) {
    await prisma.qRCodeData.create({
      data: {
        ...q,
        lastScannedAt: q.lastScannedAt ? new Date(q.lastScannedAt) : null,
        createdAt: new Date(q.createdAt),
      },
    });
  }

  for (const m of INITIAL_MEDIA) {
    await prisma.mediaItem.create({
      data: {
        ...m,
        createdAt: new Date(m.createdAt),
      },
    });
  }

  await prisma.siteSettings.create({ data: INITIAL_SETTINGS });

  for (const log of INITIAL_LOGS) {
    await prisma.activityLog.create({
      data: {
        ...log,
        createdAt: new Date(log.createdAt),
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
