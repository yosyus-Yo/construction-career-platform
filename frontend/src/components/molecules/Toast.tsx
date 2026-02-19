import React from 'react';

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div role="status" aria-live="polite" style={{ position: 'fixed', right: 20, bottom: 20, background: 'var(--color-text)', color: '#fff', padding: '10px 14px', borderRadius: 10 }}>{message}</div>;
}
