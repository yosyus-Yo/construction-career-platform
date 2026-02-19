import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { encryptPII, resumeDigestAndKeywords } from '../lib/crypto.js';
import { writeAudit } from '../modules/audit/service.js';

const router = Router();

router.post('/profile', requireAuth, requireRole('CANDIDATE'), async (req, res) => {
  const schema = z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    certifications: z.string(),
    yearsOfExp: z.number().int().min(0).max(60),
    preferredRegion: z.string(),
    experienceLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'FOREMAN', 'SITE_MANAGER']),
    resumeRaw: z.string().min(20),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const u = (req as any).user;
  const { resumeRaw, phone, ...rest } = parsed.data;
  const { digest, keywords } = resumeDigestAndKeywords(resumeRaw);

  const profile = await prisma.candidateProfile.upsert({
    where: { userId: u.sub },
    create: { userId: u.sub, ...rest, phoneEncrypted: encryptPII(phone), resumeDigest: digest, resumeKeywords: keywords },
    update: { ...rest, phoneEncrypted: encryptPII(phone), resumeDigest: digest, resumeKeywords: keywords },
  });

  await writeAudit(u.sub, 'UPSERT_PROFILE', 'CandidateProfile', profile.id, { yearsOfExp: profile.yearsOfExp });
  res.json({ id: profile.id, maskedPhone: `***${phone.slice(-4)}`, resumeDigest: profile.resumeDigest, resumeKeywords: profile.resumeKeywords });
});

export default router;
