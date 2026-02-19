import React from 'react';

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return <article className="card" style={{ padding: 16 }}>
    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>{label}</p>
    <h3 style={{ margin: '8px 0 0', fontSize: 28 }}>{value}</h3>
  </article>;
}
