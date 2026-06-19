import { useState, useMemo, useLayoutEffect } from 'react';
import type { CSSTokenMap, ElevationLevel } from '../types/admin';
import type { DesignVarsReturn } from '../types/design-vars';
import {
  COLOR_PRESETS,
  SHAPE_PRESETS,
  ELEVATION_PRESETS,
  DEFAULTS,
  loadStored,
  detectElevationLevel,
  detectMatchingPreset,
} from '../pages/admin/adminData';
import {
  hexToRgb,
  rgbToHsl,
  hslToHex,
  isHexColor,
  isWarmHex,
  desaturateHex,
} from '../pages/admin/colorUtils';

function computePopShadows(
  surfaceHex: string,
  angleDeg: number,
): CSSTokenMap | null {
  const rgb = hexToRgb(surfaceHex);
  if (!rgb) return null;
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const rad = (angleDeg * Math.PI) / 180;
  const lx = Math.round(Math.sin(rad) * 8);
  const ly = Math.round(-Math.cos(rad) * 8);
  const dx = Math.round(-Math.sin(rad) * 10);
  const dy = Math.round(Math.cos(rad) * 10);
  // Highlight: lighter hue-matched tint on light themes, barely-lighter on dark
  const lightL = Math.min(l + 0.35, 1);
  const lightRgb = hexToRgb(hslToHex(h, s * 0.2, lightL)) ?? rgb;
  const lightA = l > 0.5 ? 0.8 : 0.22;
  // Depth shadow: darker hue-matched tint; more opaque on dark themes
  const darkL = Math.max(l - 0.18, 0);
  const darkRgb = hexToRgb(hslToHex(h, Math.min(s * 1.3, 1), darkL)) ?? rgb;
  const darkA = l > 0.5 ? 0.1 : 0.48;
  const lc = `rgba(${lightRgb.join(',')},${lightA})`;
  const dc = `rgba(${darkRgb.join(',')},${darkA})`;
  return {
    '--pop-shadow-light': `${lx}px ${ly}px 18px ${lc}`,
    '--pop-shadow-dark': `${dx}px ${dy}px 22px ${dc}`,
    '--inset-shadow-highlight': `-4px -4px 8px ${lc}`,
  };
}

export function useDesignVars(): DesignVarsReturn {
  const initialVars = (() => {
    const s = loadStored();
    return s ? { ...DEFAULTS, ...s } : { ...DEFAULTS };
  })();

  const [vars, setVars] = useState(initialVars);
  const [elevationLevel, setElevationLevel] = useState(() =>
    detectElevationLevel(initialVars['--btn-elevation']),
  );
  const [customElevation, setCustomElevation] = useState(() => {
    const lv = detectElevationLevel(initialVars['--btn-elevation']);
    return lv === 'custom' ? (initialVars['--btn-elevation'] ?? '') : '';
  });
  const [activeColorPreset, setActiveColorPreset] = useState(() =>
    detectMatchingPreset(COLOR_PRESETS, initialVars),
  );
  const [activeShapePreset, setActiveShapePreset] = useState(() =>
    detectMatchingPreset(SHAPE_PRESETS, initialVars),
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
    setVars((prev) => ({ ...prev, [name]: value }));
  };

  const applyColorPreset = (name: string | null) => {
    setActiveColorPreset(name);
    if (!name) return;
    const preset = COLOR_PRESETS.find((p) => p.name === name);
    if (!preset) return;
    setVars((prev) => {
      const next = { ...prev, ...preset.vars };
      const angleDeg = parseInt(next['--shadow-angle'] ?? '315');
      const surfaceHex = (next['--color-surface'] ?? '#ffffff').trim();
      const shadows = computePopShadows(surfaceHex, angleDeg);
      return shadows ? { ...next, ...shadows } : next;
    });
  };

  const applyShapePreset = (name: string | null) => {
    setActiveShapePreset(name);
    if (!name) return;
    const preset = SHAPE_PRESETS.find((p) => p.name === name);
    if (!preset) return;
    setVars((prev) => ({ ...prev, ...preset.vars }));
    if (preset.vars['--btn-elevation'] !== undefined) {
      const level = detectElevationLevel(preset.vars['--btn-elevation']);
      setElevationLevel(level);
      if (level === 'custom')
        setCustomElevation(preset.vars['--btn-elevation']);
    }
  };

  const applyElevation = (level: ElevationLevel) => {
    setElevationLevel(level);
    if (level !== 'custom') setVar('--btn-elevation', ELEVATION_PRESETS[level]);
  };

  const resetAll = () => {
    window.localStorage.removeItem('skeuomorph:vars');
    setVars({ ...DEFAULTS });
    setElevationLevel(detectElevationLevel(DEFAULTS['--btn-elevation']));
    setCustomElevation('');
    setActiveColorPreset(detectMatchingPreset(COLOR_PRESETS, DEFAULTS));
    setActiveShapePreset(detectMatchingPreset(SHAPE_PRESETS, DEFAULTS));
  };

  const autoFixWarmTones = () => {
    const next = { ...vars };
    Object.entries(vars).forEach(([k, v]) => {
      const t = (v || '').trim();
      if (isHexColor(t) && isWarmHex(t)) next[k] = desaturateHex(t);
    });
    setVars(next);
  };

  const recomputeDepthShadows = (angleDeg: number) => {
    const extractRgba = (s: string | undefined): string | null => {
      const m = /rgba?\([^)]+\)/i.exec(s ?? '');
      return m ? m[0] : null;
    };
    const rad = (angleDeg * Math.PI) / 180;
    const lx = Math.round(Math.sin(rad) * 8);
    const ly = Math.round(-Math.cos(rad) * 8);
    const dx = Math.round(-Math.sin(rad) * 10);
    const dy = Math.round(Math.cos(rad) * 10);
    const lc =
      extractRgba(vars['--pop-shadow-light']) ?? 'rgba(255,255,255,0.9)';
    const dc = extractRgba(vars['--pop-shadow-dark']) ?? 'rgba(0,0,0,0.08)';
    setVars((prev) => ({
      ...prev,
      '--shadow-angle': String(angleDeg),
      '--pop-shadow-light': `${lx}px ${ly}px 18px ${lc}`,
      '--pop-shadow-dark': `${dx}px ${dy}px 22px ${dc}`,
    }));
  };

  const autoPopShadows = () => {
    const surfaceHex = (vars['--color-surface'] ?? '#ffffff').trim();
    const angleDeg = parseInt(vars['--shadow-angle'] ?? '315');
    const shadows = computePopShadows(surfaceHex, angleDeg);
    if (shadows) setVars((prev) => ({ ...prev, ...shadows }));
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
    elevationLevel,
    setElevationLevel,
    customElevation,
    setCustomElevation,
    activeColorPreset,
    applyColorPreset,
    activeShapePreset,
    applyShapePreset,
    applyElevation,
    resetAll,
    warmFound,
    warmKeys,
    dismissWarmTones: () => {
      setWarmDismissed(true);
    },
    autoFixWarmTones,
    recomputeDepthShadows,
    autoPopShadows,
    copySuccess,
    exportCSS,
    exportText,
  };
}
