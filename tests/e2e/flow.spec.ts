import { test, expect } from '@playwright/test';

test('핵심 플로우: 회원가입→공고→지원→상태변경→오퍼→관리자 검증', async ({ request }) => {
  const key = Date.now();
  const recruiterEmail = `recruiter_${key}@test.com`;
  const candidateEmail = `candidate_${key}@test.com`;
  const password = 'Password12!';

  const adminEmail = `admin_${key}@test.com`;
  const recruiter = await request.post('/api/auth/register', { data: { email: recruiterEmail, password, role: 'RECRUITER' } });
  const candidate = await request.post('/api/auth/register', { data: { email: candidateEmail, password, role: 'CANDIDATE' } });
  const admin = await request.post('/api/auth/register', { data: { email: adminEmail, password, role: 'ADMIN' } });
  expect(recruiter.ok()).toBeTruthy();
  expect(candidate.ok()).toBeTruthy();
  expect(admin.ok()).toBeTruthy();

  const recruiterJson = await recruiter.json();
  const candidateJson = await candidate.json();
  const adminJson = await admin.json();

  const job = await request.post('/api/jobs', {
    headers: { Authorization: `Bearer ${recruiterJson.token}` },
    data: {
      title: '품질관리 책임자', companyName: '케이건설', siteLocation: '서울', requiredCerts: '산업안전기사',
      requiredYears: 5, salaryRange: '5000-6500', description: '품질 및 안전 기준 점검과 시정조치 운영을 담당합니다.',
    },
  });
  expect(job.status()).toBe(201);
  const jobJson = await job.json();

  const profile = await request.post('/api/candidate/profile', {
    headers: { Authorization: `Bearer ${candidateJson.token}` },
    data: {
      fullName: '지원자', phone: '01012341234', certifications: '산업안전기사', yearsOfExp: 8,
      preferredRegion: '서울', experienceLevel: 'SENIOR', resumeRaw: '건설 현장 안전관리 및 품질관리 8년 경력, 대형 프로젝트 수행',
    },
  });
  expect(profile.ok()).toBeTruthy();

  const apply = await request.post('/api/applications', {
    headers: { Authorization: `Bearer ${candidateJson.token}` },
    data: { jobPostId: jobJson.id, note: '지원서 제출' },
  });
  expect(apply.status()).toBe(201);
  const applyJson = await apply.json();

  const applicants = await request.get('/api/recruiter/applicants', {
    headers: { Authorization: `Bearer ${recruiterJson.token}` },
  });
  expect(applicants.ok()).toBeTruthy();
  const applicantsJson = await applicants.json();
  expect(applicantsJson.find((x: any) => x.id === applyJson.id)).toBeTruthy();

  const update = await request.patch(`/api/applications/${applyJson.id}/status`, {
    headers: { Authorization: `Bearer ${recruiterJson.token}` },
    data: { status: 'INTERVIEW' },
  });
  expect(update.ok()).toBeTruthy();

  const offer = await request.post('/api/recruiter/offers', {
    headers: { Authorization: `Bearer ${recruiterJson.token}` },
    data: { applicationId: applyJson.id, message: '면접 이후 채용 제안을 드립니다.' },
  });
  expect(offer.status()).toBe(201);

  const dashboard = await request.get('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminJson.token}` },
  });
  expect(dashboard.ok()).toBeTruthy();
  const dashboardJson = await dashboard.json();
  expect(dashboardJson.applications).toBeGreaterThan(0);
});
