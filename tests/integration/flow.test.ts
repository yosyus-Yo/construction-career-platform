import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

beforeAll(async () => {
  await prisma.application.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.jobPost.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
});

describe('recruiting flow', () => {
  it('register -> create profile -> create job -> apply', async () => {
    const recruiter = await request(app).post('/api/auth/register').send({ email: 'rec@test.com', password: 'Password12!', role: 'RECRUITER' });
    const candidate = await request(app).post('/api/auth/register').send({ email: 'cand@test.com', password: 'Password12!', role: 'CANDIDATE' });

    const recToken = recruiter.body.token;
    const candToken = candidate.body.token;

    const profile = await request(app)
      .post('/api/candidate/profile')
      .set('Authorization', `Bearer ${candToken}`)
      .send({
        fullName: '홍길동',
        phone: '01012345678',
        certifications: '산업안전기사,건축기사',
        yearsOfExp: 8,
        preferredRegion: '서울',
        experienceLevel: 'SENIOR',
        resumeRaw: '대형 건설 현장 안전관리 8년, 산업안전기사 보유 및 협력사 교육 다수 진행',
      });
    expect(profile.status).toBe(200);

    const job = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${recToken}`)
      .send({
        title: '현장 안전관리자',
        companyName: '한건설',
        siteLocation: '서울 강남',
        requiredCerts: '산업안전기사',
        requiredYears: 5,
        salaryRange: '5000~6500',
        description: '대규모 현장 안전관리 및 협력사 안전교육, 위험성평가 문서화 작업 수행',
      });
    expect(job.status).toBe(201);

    const apply = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${candToken}`)
      .send({ jobPostId: job.body.id, note: '즉시 출근 가능' });

    expect(apply.status).toBe(201);
    expect(apply.body.fitScore).toBeGreaterThan(50);
  });
});
