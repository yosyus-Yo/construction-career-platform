import React from 'react';

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' }) {
  const bg = tone === 'success' ? 'rgba(22,163,74,.15)' : tone === 'warning' ? 'rgba(217,119,6,.15)' : 'rgba(100,116,139,.15)';
  return <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: 12, background: bg }}>{children}</span>;
}
