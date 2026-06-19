import type React from 'react';

export function Card({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string | undefined;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={['skeu-card', className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
