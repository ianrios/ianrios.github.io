import { useMemo, useState } from 'react';
import type React from 'react';
import { DesignPanelContext } from './designPanelContext';

export function DesignPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default-open only when the visit begins on the design system; other
  // routes start closed. The design-system nav link re-opens it on arrival.
  const [open, setOpen] = useState(
    () => window.location.pathname === '/design-system',
  );
  const [revealed, setRevealed] = useState(false);
  const value = useMemo(
    () => ({ open, setOpen, revealed, setRevealed }),
    [open, revealed],
  );
  return (
    <DesignPanelContext.Provider value={value}>
      {children}
    </DesignPanelContext.Provider>
  );
}
