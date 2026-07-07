import { useMemo, useState } from 'react';
import type React from 'react';
import { NavChromeContext } from './navChromeContext';

export function NavChromeProvider({ children }: { children: React.ReactNode }) {
  // '/' boots into the MetaBalls splash; start hidden there so the nav can
  // never paint over it. Home reveals it once the main view is up.
  const [hidden, setHidden] = useState(() => window.location.pathname === '/');
  const value = useMemo(() => ({ hidden, setHidden }), [hidden]);
  return (
    <NavChromeContext.Provider value={value}>
      {children}
    </NavChromeContext.Provider>
  );
}
