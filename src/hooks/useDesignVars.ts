import { useState, useMemo, useLayoutEffect } from 'react';
import type { CSSTokenMap } from '../types/admin';
import type { DesignVarsReturn } from '../types/design-vars';
import {
  THEMES,
  DEFAULTS,
  loadStored,
  detectMatchingPreset,
} from '../pages/admin/adminData';
import {
  isHexColor,
  isWarmHex,
  desaturateHex,
} from '../pages/admin/colorUtils';
import { computeBevelTones } from '../pages/admin/bevelTones';

// Re-derive the eight bevel tone vars from the current --color-bg +
// --color-surface and merge them over `next`. Precedence: any bg/surface change
// overwrites the derived tone vars (they are derived, never hand-authored).
// Cheap — only runs on color edits, preset apply and reset.
const withBevelTones = (next: CSSTokenMap): CSSTokenMap => {
  const bgHex = (next['--color-bg'] ?? '#0a0e0a').trim();
  const surfaceHex = (next['--color-surface'] ?? '#0f1a0f').trim();
  const contrast = parseFloat(next['--depth-contrast'] ?? '1') || 1;
  const tones = computeBevelTones(bgHex, surfaceHex, contrast);
  return tones ? { ...next, ...tones } : next;
};

export function useDesignVars(): DesignVarsReturn {
  const initialVars = (() => {
    const s = loadStored();
    const base = s ? { ...DEFAULTS, ...s } : { ...DEFAULTS };
    // Always re-derive bevel tones from the resolved bg/surface so they match
    // the loaded theme (tones are derived; stored values are safely replaced).
    return withBevelTones(base);
  })();

  const [vars, setVars] = useState(initialVars);
  const [activeTheme, setActiveTheme] = useState(() =>
    detectMatchingPreset(THEMES, initialVars),
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [warmDismissed, setWarmDismissed] = useState(false);

  useLayoutEffect(() => {
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    const fastS = (
      (parseFloat(vars['--anim-speed'] ?? '0.12') || 0.12) * 0.5
    ).toFixed(3);
    document.documentElement.style.setProperty(
      '--anim-speed-fast',
      `${fastS}s`,
    );
    window.localStorage.setItem('skeuomorph:vars', JSON.stringify(vars));
  }, [vars]);

  const warmKeys = useMemo(
    () =>
      Object.entries(vars)
        .filter(([, v]) => isHexColor(v.trim()) && isWarmHex(v.trim()))
        .map(([k]) => k),
    [vars],
  );
  const warmFound = warmKeys.length > 0 && !warmDismissed;

  const setVar = (name: string, value: string) => {
    setVars((prev) => {
      const next = { ...prev, [name]: value };
      // A background, surface, or depth-contrast edit re-blends every derived
      // bevel tone live (contrast scales the tone lightness delta).
      return name === '--color-bg' ||
        name === '--color-surface' ||
        name === '--depth-contrast'
        ? withBevelTones(next)
        : next;
    });
  };

  // One click applies an entire theme: every category's vars at once, then the
  // bevel tones are re-derived from the theme's bg/surface + depth-contrast.
  const applyTheme = (name: string | null) => {
    setActiveTheme(name);
    if (!name) return;
    const preset = THEMES.find((p) => p.name === name);
    if (!preset) return;
    setVars((prev) => withBevelTones({ ...prev, ...preset.vars }));
  };

  const resetAll = () => {
    window.localStorage.removeItem('skeuomorph:vars');
    setVars(withBevelTones({ ...DEFAULTS }));
    setActiveTheme(detectMatchingPreset(THEMES, DEFAULTS));
  };

  const autoFixWarmTones = () => {
    const next = { ...vars };
    Object.entries(vars).forEach(([k, v]) => {
      const t = (v || '').trim();
      if (isHexColor(t) && isWarmHex(t)) next[k] = desaturateHex(t);
    });
    setVars(next);
  };

  // Re-derive the bevel tones from the current bg/surface (the "Auto from
  // backdrop" button) — useful after manual color edits land out of order.
  const autoBevelTones = () => {
    setVars((prev) => withBevelTones({ ...prev }));
  };

  const exportCSS = () => {
    const css = `:root {\n${Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}`;
    const onSuccess = () => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    };
    void navigator.clipboard.writeText(css).then(onSuccess);
  };

  const exportText = `:root {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;

  return {
    vars,
    setVar,
    setVars,
    activeTheme,
    applyTheme,
    resetAll,
    warmFound,
    warmKeys,
    dismissWarmTones: () => {
      setWarmDismissed(true);
    },
    autoFixWarmTones,
    autoBevelTones,
    copySuccess,
    exportCSS,
    exportText,
  };
}
