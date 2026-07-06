import { createContext, useContext } from 'react';
import type { DesignVarsReturn } from '../types/design-vars';

// One design-vars state for the whole app (provided in App.tsx). A single
// provider means one :root writer and one localStorage writer, however many
// panels are on screen (Home, Admin, and Admin's embedded Home preview).
export const DesignVarsContext = createContext<DesignVarsReturn | null>(null);

export function useDesignVars(): DesignVarsReturn {
  const ctx = useContext(DesignVarsContext);
  if (!ctx) throw new Error('useDesignVars requires <DesignVarsProvider>');
  return ctx;
}
