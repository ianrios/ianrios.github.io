import type React from 'react';

export function SectionLabel({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        color: 'var(--color-muted)',
        marginBottom: 6,
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

export function TierLabel({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: 700,
        color: 'var(--color-bg)',
        background: 'var(--color-muted)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        marginTop: 20,
        marginBottom: 10,
        display: 'inline-block',
      }}
    >
      {children}
    </div>
  );
}
