import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function AdminPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    api('/admin/dashboard').then(setDashboard).catch(() => setDashboard(null));
    api<any[]>('/admin/audits').then(setAudits).catch(() => setAudits([]));
  }, []);

  return <section>
    <h2>관리자 센터</h2>
    <article className="card" style={{ padding: 16, marginBottom: 12 }}>
      <pre>{JSON.stringify(dashboard, null, 2)}</pre>
    </article>
    <article className="card" style={{ padding: 16 }}>
      <h3>감사 로그</h3>
      <pre>{JSON.stringify(audits.slice(0, 10), null, 2)}</pre>
    </article>
  </section>;
}
