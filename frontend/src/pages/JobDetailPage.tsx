import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { useAuth } from '../providers/AuthProvider';

export function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [note, setNote] = useState('지원합니다.');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api<any[]>('/jobs').then(list => setJob(list.find(j => j.id === id)));
  }, [id]);

  const apply = async () => {
    try {
      await api('/candidate/profile', 'POST', {
        fullName: '프론트 사용자', phone: '01099990000', certifications: job.requiredCerts || '산업안전기사', yearsOfExp: 6,
        preferredRegion: job.siteLocation || '서울', experienceLevel: 'SENIOR', resumeRaw: '건설 현장 경력 및 안전관리, 품질관리 실무 경험 보유',
      });
      await api('/applications', 'POST', { jobPostId: job.id, note });
      setMsg('지원이 완료되었습니다.');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  if (!job) return <p>로딩 중...</p>;
  return <section className="card" style={{ padding: 20 }}>
    <h2>{job.title}</h2>
    <p>{job.companyName} · {job.siteLocation}</p>
    <p>{job.description}</p>
    {user?.role === 'CANDIDATE' && <>
      <Input value={note} onChange={e => setNote(e.target.value)} />
      <Button onClick={apply} style={{ marginTop: 10 }}>지원하기</Button>
    </>}
    {msg && <p>{msg}</p>}
  </section>;
}
