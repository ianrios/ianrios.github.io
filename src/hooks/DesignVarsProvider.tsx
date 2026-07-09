import { useState, useMemo, useLayoutEffect } from 'react';
import type React from 'react';
import type { CSSTokenMap } from '../types/admin';
import type { DesignVarsReturn } from '../types/design-vars';
import { DesignVarsContext } from './designVarsContext';
import { THEMES, DEFAULTS, DEFAULT_THEME } from '../pages/admin/adminData';
import {
  loadStoredDesign,
  persistDesign,
  type DesignState,
} from '../pages/admin/designStorage';
import { computeBevelTones } from '../pages/admin/bevelTones';

// Re-derive the eight bevel tone vars from the current --color-bg +
// --color-surface + --depth-contrast and merge them over `next`. Tones are
// derived, never hand-authored, so every resolution recomputes them.
const withBevelTones = (next: CSSTokenMap): CSSTokenMap => {
  const bgHex = (next['--color-bg'] ?? '#000000').trim();
  const surfaceHex = (next['--color-surface'] ?? '#101010').trim();
  const contrast = parseFloat(next['--depth-contrast'] ?? '2') || 2;
  const tones = computeBevelTones(bgHex, surfaceHex, contrast);
  return tones ? { ...next, ...tones } : next;
};

const themeVars = (theme: string | null): CSSTokenMap =>
  theme ? (THEMES.find((p) => p.name === theme)?.vars ?? {}) : {};

// DEFAULTS ∪ theme ∪ user overrides, bevel tones re-derived last.
const resolveVars = (state: DesignState): CSSTokenMap =>
  withBevelTones({
    ...DEFAULTS,
    ...themeVars(state.theme),
    ...state.overrides,
  });

// `touched` gates persistence: a clean first visit writes nothing, so future
// default-theme changes still reach visitors who never customized (F5).
interface HookState extends DesignState {
  touched: boolean;
}

function useDesignVarsState(): DesignVarsReturn {
  const [state, setState] = useState<HookState>(() => {
    const stored = loadStoredDesign(THEMES);
    if (stored) return { ...stored, touched: true };
    // No stored design: a purely random pick is not a choice, so it never
    // persists (touched stays false) — an untouched visitor re-rolls a new
    // random theme on every visit, forever.
    const picked = THEMES[Math.floor(Math.random() * THEMES.length)]?.name;
    return { theme: picked ?? DEFAULT_THEME, overrides: {}, touched: false };
  });

  const vars = useMemo(() => resolveVars(state), [state]);

  useLayoutEffect(() => {
    const fastS = (
      (parseFloat(vars['--anim-speed'] ?? '0.1') || 0.1) * 0.5
    ).toFixed(3);
    const snapshot = { ...vars, '--anim-speed-fast': `${fastS}s` };
    Object.entries(snapshot).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    if (state.touched) {
      persistDesign(
        { theme: state.theme, overrides: state.overrides },
        snapshot,
      );
    }
  }, [vars, state]);

  const setVar = (name: string, value: string) => {
    setState((prev) => {
      const baseline = themeVars(prev.theme)[name] ?? DEFAULTS[name];
      // editing back to the theme's own value clears the override
      const overrides = Object.fromEntries(
        Object.entries(prev.overrides).filter(([k]) => k !== name),
      );
      if (value !== baseline) overrides[name] = value;
      return { ...prev, overrides, touched: true };
    });
  };

  // One click applies an entire theme and drops all overrides.
  const applyTheme = (name: string | null) => {
    if (!name || !THEMES.some((p) => p.name === name)) return;
    setState({ theme: name, overrides: {}, touched: true });
  };

  // Reset returns to the currently active preset's clean defaults, not the
  // global DEFAULT_THEME — only a theme-less visitor (raw overrides, no
  // preset ever chosen) has no "preset defaults" to fall back to. Setting
  // `touched: true` lets the persist effect above write the clean state to
  // storage, same as `applyTheme`, so it survives a reload.
  const resetAll = () => {
    setState((prev) => ({
      theme: prev.theme ?? DEFAULT_THEME,
      overrides: {},
      touched: true,
    }));
  };

  const exportText = `:root {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;

  return {
    vars,
    setVar,
    activeTheme: state.theme,
    applyTheme,
    resetAll,
    exportText,
  };
}

export function DesignVarsProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const value = useDesignVarsState();
  return (
    <DesignVarsContext.Provider value={value}>
      {children}
    </DesignVarsContext.Provider>
  );
}
