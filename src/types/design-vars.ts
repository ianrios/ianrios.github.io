import type { CSSTokenMap } from './admin';

export interface DesignVarsReturn {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  activeTheme: string | null;
  applyTheme: (name: string | null) => void;
  resetAll: () => void;
  exportText: string;
}
