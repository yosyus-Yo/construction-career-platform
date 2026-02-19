import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { api } from '../api';
import { StatCard } from '../components/sections/StatCard';

export function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    api<any[]>('/jobs').then(setJobs).catch(() => setJobs([]));
    if (user?.role !== 'CANDIDATE') api<any[]>('/recruiter/applicants').then(setApps).catch(() => setApps([]));
  }, [user?.role]);

  return <section>
    <h2>대시보드</h2>
    <div className="grid">
      <div style={{ gridColumn: 'span 4' }}><StatCard label="전체 공고" value={jobs.length} /></div>
      <div style={{ gridColumn: 'span 4' }}><StatCard label="조회된 지원서" value={apps.length} /></div>
      <div style={{ gridColumn: 'span 4' }}><StatCard label="내 역할" value={user?.role || '-'} /></div>
    </div>
  </section>;
}
