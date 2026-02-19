import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' };

export function Button({ variant = 'primary', style, ...props }: Props) {
  const bg = variant === 'primary' ? 'var(--color-brand)' : variant === 'danger' ? 'var(--color-danger)' : 'transparent';
  const color = variant === 'ghost' ? 'var(--color-text)' : '#fff';
  return <button
    {...props}
    style={{
      border: variant === 'ghost' ? '1px solid var(--color-border)' : 'none',
      background: bg,
      color,
      borderRadius: '10px',
      padding: '10px 14px',
      fontWeight: 600,
      cursor: 'pointer',
      ...style,
    }}
  />;
}
