import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { writeAudit } from '../modules/audit/service.js';

const router = Router();

router.post('/', requireAuth, requireRole('CANDIDATE'), async (req, res) => {
  const schema = z.object({ jobPostId: z.string().min(1), note: z.string().max(500).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const u = (req as any).user;

  const profile = await prisma.candidateProfile.findUnique({ where: { userId: u.sub } });
  if (!profile) return res.status(400).json({ error: 'Profile required' });
  const job = await prisma.jobPost.findUnique({ where: { id: parsed.data.jobPostId } });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const fitScore = Math.min(100, Math.max(0, (profile.yearsOfExp / Math.max(1, job.requiredYears)) * 60 + (profile.certifications.includes(job.requiredCerts) ? 40 : 10)));
  const app = await prisma.application.create({ data: { candidateId: u.sub, jobPostId: job.id, fitScore, note: parsed.data.note } });
  await writeAudit(u.sub, 'APPLY_JOB', 'Application', app.id, { fitScore });
  res.status(201).json(app);
});

router.patch('/:id/status', requireAuth, requireRole('RECRUITER', 'ADMIN'), async (req, res) => {
  const schema = z.object({ status: z.enum(['SUBMITTED', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED']) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const applicationId = String(req.params.id);
  const app = await prisma.application.update({ where: { id: applicationId }, data: { status: parsed.data.status } });
  await writeAudit((req as any).user.sub, 'UPDATE_APP_STATUS', 'Application', app.id, { status: app.status });
  res.json(app);
});

export default router;
