import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api, login, register, Role } from './api';

type User = { id: string; email: string; role: Role };

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password12!');
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [msg, setMsg] = useState('');

  const auth = async (mode: 'login' | 'register') => {
    const result = mode === 'login' ? await login(email, password) : await register(email, password, role);
    localStorage.setItem('token', result.token);
    setUser(result.user);
  };

  const loadJobs = async () => setJobs(await api('/jobs'));
  const createProfileAndApply = async (jobPostId: string) => {
    await api('/candidate/profile', 'POST', {
      fullName: '테스트 구직자', phone: '01011112222', certifications: '산업안전기사', yearsOfExp: 7,
      preferredRegion: '서울', experienceLevel: 'SENIOR', resumeRaw: '건설 현장 경력 7년, 안전관리 및 공정관리 경험 보유',
    });
    await api('/applications', 'POST', { jobPostId, note: '지원합니다.' });
    setMsg('지원 완료');
  };

  const createJob = async () => {
    await api('/jobs', 'POST', {
      title: '현장소장', companyName: '한건설', siteLocation: '부산', requiredCerts: '산업안전기사',
      requiredYears: 5, salaryRange: '6000-7500', description: '현장 총괄 및 안전관리, 공정관리 책임 역할 수행',
    });
    setMsg('공고 등록 완료');
  };

  const loadApplicants = async () => setApplicants(await api('/recruiter/applicants'));
  const sendOffer = async (applicationId: string) => {
    await api('/recruiter/offers', 'POST', { applicationId, message: '면접 후 채용 제안을 드립니다.' });
    setMsg('제안 발송 완료');
  };

  const loadAdmin = async () => {
    setDashboard(await api('/admin/dashboard'));
    setAudits(await api('/admin/audits'));
  };

  return <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
    <h1>건설업 경력직 채용 플랫폼</h1>
    {!user ? <section>
      <h2>회원/로그인</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="CANDIDATE">구직자</option><option value="RECRUITER">기업</option><option value="ADMIN">관리자</option>
      </select>
      <button onClick={() => auth('register')}>회원가입</button>
      <button onClick={() => auth('login')}>로그인</button>
    </section> : <section><p>로그인: {user.email} ({user.role})</p></section>}

    {user?.role === 'CANDIDATE' && <section>
      <h2>구직자 흐름</h2>
      <button onClick={loadJobs}>공고 목록 조회</button>
      <ul>{jobs.map(j => <li key={j.id}>{j.title} <button onClick={() => createProfileAndApply(j.id)}>지원</button></li>)}</ul>
    </section>}

    {user?.role === 'RECRUITER' && <section>
      <h2>기업 흐름</h2>
      <button onClick={createJob}>공고 등록</button>
      <button onClick={loadApplicants}>지원자 목록 조회</button>
      <ul>{applicants.map(a => <li key={a.id}>{a.candidate.email} / {a.jobPost.title} <button onClick={() => sendOffer(a.id)}>제안 발송</button></li>)}</ul>
    </section>}

    {user?.role === 'ADMIN' && <section>
      <h2>관리자</h2>
      <button onClick={loadAdmin}>대시보드/감사로그 조회</button>
      {dashboard && <pre>{JSON.stringify(dashboard, null, 2)}</pre>}
      <pre>{JSON.stringify(audits.slice(0, 5), null, 2)}</pre>
    </section>}

    <p>{msg}</p>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
