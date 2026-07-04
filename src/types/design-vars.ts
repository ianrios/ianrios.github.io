import type { Dispatch, SetStateAction } from 'react';
import type { CSSTokenMap } from './admin';

export interface DesignVarsReturn {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  setVars: Dispatch<SetStateAction<CSSTokenMap>>;
  activeTheme: string | null;
  applyTheme: (name: string | null) => void;
  resetAll: () => void;
  warmFound: boolean;
  warmKeys: string[];
  dismissWarmTones: () => void;
  autoFixWarmTones: () => void;
  autoBevelTones: () => void;
  copySuccess: boolean;
  exportCSS: () => void;
  exportText: string;
}
