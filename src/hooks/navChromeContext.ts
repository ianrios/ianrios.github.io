import { createContext, useContext } from 'react';

export interface NavChrome {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

// Lets route-local state (Home's splash view) hide app-root chrome (SiteNav)
// without lifting that state out of the page that owns it.
export const NavChromeContext = createContext<NavChrome | null>(null);

export function useNavChrome(): NavChrome {
  const ctx = useContext(NavChromeContext);
  if (!ctx) throw new Error('useNavChrome requires <NavChromeProvider>');
  return ctx;
}
