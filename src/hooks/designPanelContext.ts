import { createContext, useContext } from 'react';

export interface DesignPanel {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** True once the tab has revealed, so route remounts do not replay it. */
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
}

// One shared design-panel state so opening it on one route keeps it open on
// the next, and the reveal animation never replays on remount.
export const DesignPanelContext = createContext<DesignPanel | null>(null);

export function useDesignPanel(): DesignPanel {
  const ctx = useContext(DesignPanelContext);
  if (!ctx) throw new Error('useDesignPanel requires <DesignPanelProvider>');
  return ctx;
}
