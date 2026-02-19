import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js';
import { writeAudit } from '../modules/audit/service.js';

const router = Router();

router.post('/register', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8), role: z.enum(['ADMIN', 'RECRUITER', 'CANDIDATE']) });
  const input = schema.safeParse(req.body);
  if (!input.success) return res.status(400).json(input.error.flatten());
  const { email, password, role } = input.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email exists' });

  const user = await prisma.user.create({ data: { email, passwordHash: await hashPassword(password), role } });
  await writeAudit(user.id, 'USER_REGISTER', 'User', user.id, { role });
  res.status(201).json({ token: signToken({ sub: user.id, role }), user: { id: user.id, email, role } });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() });
  const input = schema.safeParse(req.body);
  if (!input.success) return res.status(400).json(input.error.flatten());
  const user = await prisma.user.findUnique({ where: { email: input.data.email } });
  if (!user) return res.status(401).json({ error: 'Invalid credential' });
  const ok = await verifyPassword(input.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credential' });
  await writeAudit(user.id, 'USER_LOGIN', 'User', user.id);
  res.json({ token: signToken({ sub: user.id, role: user.role as any }), user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
