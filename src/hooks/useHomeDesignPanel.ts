import { useDesignVars } from './designVarsContext';
import { THEMES } from '../pages/admin/adminData';

export function useHomeDesignPanel() {
  const { vars, setVar, activeTheme, applyTheme, resetAll } = useDesignVars();

  return {
    vars,
    setVar,
    themes: THEMES,
    activeTheme,
    applyTheme,
    resetAll,
  };
}
