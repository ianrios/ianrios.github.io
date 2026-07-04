import type React from 'react';
import { useDesignVars } from './useDesignVars';
import { THEMES } from '../pages/admin/adminData';

const SIDEBAR_STYLE: React.CSSProperties = {
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  paddingRight: 0,
  boxSizing: 'border-box',
  flexShrink: 1,
  minWidth: 0,
  padding: 'var(--space-sm)',
};

export function useHomeDesignPanel() {
  const {
    vars,
    setVar,
    activeTheme,
    applyTheme,
    warmFound,
    warmKeys,
    dismissWarmTones,
    autoFixWarmTones,
    autoBevelTones,
  } = useDesignVars();

  return {
    vars,
    setVar,
    themes: THEMES,
    activeTheme,
    applyTheme,
    autoBevelTones,
    warmFound,
    warmKeys,
    autoFixWarmTones,
    dismissWarmTones,
    sidebarStyle: SIDEBAR_STYLE,
  };
}
