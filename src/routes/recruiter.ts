import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { writeAudit } from '../modules/audit/service.js';

const router = Router();

router.get('/applicants', requireAuth, requireRole('RECRUITER', 'ADMIN'), async (req, res) => {
  const user = (req as any).user;
  const where = user.role === 'ADMIN' ? {} : { jobPost: { recruiterId: user.sub } };

  const items = await prisma.application.findMany({
    where,
    include: {
      candidate: { select: { id: true, email: true } },
      jobPost: { select: { id: true, title: true, companyName: true } },
      offers: { select: { id: true, message: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json(items);
});

router.post('/offers', requireAuth, requireRole('RECRUITER', 'ADMIN'), async (req, res) => {
  const schema = z.object({ applicationId: z.string().min(1), message: z.string().min(10).max(500) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const user = (req as any).user;
  const app = await prisma.application.findUnique({
    where: { id: parsed.data.applicationId },
    include: { jobPost: { select: { recruiterId: true } } },
  });

  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (user.role !== 'ADMIN' && app.jobPost.recruiterId !== user.sub) return res.status(403).json({ error: 'Forbidden' });

  const offer = await prisma.offer.create({
    data: {
      applicationId: app.id,
      recruiterId: user.sub,
      message: parsed.data.message,
    },
  });

  await prisma.application.update({ where: { id: app.id }, data: { status: 'OFFER' } });
  await writeAudit(user.sub, 'SEND_OFFER', 'Offer', offer.id, { applicationId: app.id });

  res.status(201).json(offer);
});

export default router;
