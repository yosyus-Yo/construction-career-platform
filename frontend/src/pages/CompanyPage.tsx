import React, { useState } from 'react';
import { api } from '../api';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';

export function CompanyPage() {
  const [title, setTitle] = useState('현장소장');
  const [msg, setMsg] = useState('');

  const createJob = async () => {
    try {
      await api('/jobs', 'POST', {
        title,
        companyName: '스마트건설',
        siteLocation: '서울',
        requiredCerts: '산업안전기사',
        requiredYears: 5,
        salaryRange: '6500-8000',
        description: '프로젝트 총괄 및 공정/안전 운영을 담당하며 협력사 커뮤니케이션을 리딩합니다.',
      });
      setMsg('공고 등록 완료');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  return <section className="card" style={{ padding: 20 }}>
    <h2>기업 관리</h2>
    <Input value={title} onChange={e => setTitle(e.target.value)} />
    <Button onClick={createJob} style={{ marginTop: 10 }}>공고 등록</Button>
    {msg && <p>{msg}</p>}
  </section>;
}
