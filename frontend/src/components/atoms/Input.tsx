import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input
    {...props}
    style={{
      width: '100%',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '10px 12px',
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
    }}
  />;
}
