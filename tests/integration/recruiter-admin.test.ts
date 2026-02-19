import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../src/app.js';

describe('recruiter/admin endpoints', () => {
  it('recruiter can list applicants and send offer / admin can read dashboard', async () => {
    const key = Date.now();
    const recruiter = await request(app).post('/api/auth/register').send({ email: `rec_${key}@t.com`, password: 'Password12!', role: 'RECRUITER' });
    const candidate = await request(app).post('/api/auth/register').send({ email: `cand_${key}@t.com`, password: 'Password12!', role: 'CANDIDATE' });
    const admin = await request(app).post('/api/auth/register').send({ email: `admin_${key}@t.com`, password: 'Password12!', role: 'ADMIN' });

    const recToken = recruiter.body.token;
    const candToken = candidate.body.token;
    const adminToken = admin.body.token;

    const job = await request(app).post('/api/jobs').set('Authorization', `Bearer ${recToken}`).send({
      title: '안전관리자', companyName: '테스트건설', siteLocation: '인천', requiredCerts: '산업안전기사', requiredYears: 3,
      salaryRange: '4500-5500', description: '현장 안전관리 업무와 문서화, 협력사 안전 교육을 담당합니다.',
    });

    await request(app).post('/api/candidate/profile').set('Authorization', `Bearer ${candToken}`).send({
      fullName: '지원자', phone: '01022223333', certifications: '산업안전기사', yearsOfExp: 5,
      preferredRegion: '인천', experienceLevel: 'MID', resumeRaw: '건설 현장 경험 5년, 안전관리와 품질점검 경험 보유',
    });

    const apply = await request(app).post('/api/applications').set('Authorization', `Bearer ${candToken}`).send({ jobPostId: job.body.id });

    const applicants = await request(app).get('/api/recruiter/applicants').set('Authorization', `Bearer ${recToken}`);
    expect(applicants.status).toBe(200);
    expect(applicants.body.some((x: any) => x.id === apply.body.id)).toBe(true);

    const offer = await request(app).post('/api/recruiter/offers').set('Authorization', `Bearer ${recToken}`).send({
      applicationId: apply.body.id,
      message: '면접 결과가 좋아 정식 제안을 드립니다.',
    });
    expect(offer.status).toBe(201);

    const dashboard = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${adminToken}`);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.users).toBeGreaterThan(0);
  });
});
