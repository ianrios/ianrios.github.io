import type { Dispatch, SetStateAction } from 'react';
import type { CSSTokenMap, ElevationLevel } from './admin';

export interface DesignVarsReturn {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  setVars: Dispatch<SetStateAction<CSSTokenMap>>;
  elevationLevel: ElevationLevel;
  setElevationLevel: Dispatch<SetStateAction<ElevationLevel>>;
  customElevation: string;
  setCustomElevation: Dispatch<SetStateAction<string>>;
  activeColorPreset: string | null;
  applyColorPreset: (name: string | null) => void;
  activeShapePreset: string | null;
  applyShapePreset: (name: string | null) => void;
  applyElevation: (level: ElevationLevel) => void;
  resetAll: () => void;
  warmFound: boolean;
  warmKeys: string[];
  dismissWarmTones: () => void;
  autoFixWarmTones: () => void;
  recomputeDepthShadows: (angleDeg: number) => void;
  autoPopShadows: () => void;
  copySuccess: boolean;
  exportCSS: () => void;
  exportText: string;
}
