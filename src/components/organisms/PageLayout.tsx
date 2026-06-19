import type React from 'react';

export function PageLayout({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
