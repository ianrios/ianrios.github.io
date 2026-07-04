import type React from 'react';

export function SectionLabel({ children }: { children?: React.ReactNode }) {
  return <div className="skeu-control-sublabel">{children}</div>;
}

export function TierLabel({ children }: { children?: React.ReactNode }) {
  return <div className="skeu-tier-label">{children}</div>;
}
