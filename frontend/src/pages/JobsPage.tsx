import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Badge } from '../components/molecules/Badge';

export function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => { api<any[]>('/jobs').then(setJobs).catch(() => setJobs([])); }, []);
  return <section>
    <h2>공고 목록</h2>
    <div style={{ display: 'grid', gap: 12 }}>
      {jobs.map(job => <article key={job.id} className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{job.title}</h3>
          <Badge>{job.requiredYears}+년</Badge>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>{job.companyName} · {job.siteLocation} · {job.salaryRange}</p>
        <Link to={`/jobs/${job.id}`}>상세 보기</Link>
      </article>)}
    </div>
  </section>;
}
