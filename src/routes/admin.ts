import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/dashboard', requireAuth, requireRole('ADMIN'), async (_req, res) => {
  const [users, jobs, applications, offers] = await Promise.all([
    prisma.user.count(),
    prisma.jobPost.count(),
    prisma.application.count(),
    prisma.offer.count(),
  ]);

  res.json({ users, jobs, applications, offers });
});

router.get('/audits', requireAuth, requireRole('ADMIN'), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(logs);
});

export default router;
