import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { writeAudit } from '../modules/audit/service.js';

const router = Router();

router.post('/', requireAuth, requireRole('RECRUITER', 'ADMIN'), async (req, res) => {
  const schema = z.object({
    title: z.string().min(3),
    companyName: z.string().min(2),
    siteLocation: z.string().min(2),
    requiredCerts: z.string(),
    requiredYears: z.number().int().min(0).max(40),
    salaryRange: z.string(),
    description: z.string().min(30),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const u = (req as any).user;
  const post = await prisma.jobPost.create({ data: { ...parsed.data, recruiterId: u.sub } });
  await writeAudit(u.sub, 'CREATE_JOB', 'JobPost', post.id, { title: post.title });
  res.status(201).json(post);
});

router.get('/', requireAuth, async (_req, res) => {
  const list = await prisma.jobPost.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

export default router;
