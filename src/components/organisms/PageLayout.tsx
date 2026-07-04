import type React from 'react';

export function PageLayout({ children }: { children?: React.ReactNode }) {
  return <div className="skeu-page-layout">{children}</div>;
}
