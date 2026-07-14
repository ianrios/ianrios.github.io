// Theme-blend logic for PresetDial, kept separate so the component stays
// focused on the floating-panel mechanics (drag/dock/animate).
import { THEMES } from '../../pages/admin/adminData';
import {
  blendColor,
  blendNumeric,
  isColorValue,
} from '../../pages/admin/themeInterpolate';
import { hexToRgb, rgbToHsl } from '../../pages/admin/colorUtils';

function themeBgLightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [, , l] = rgbToHsl(...rgb);
  return l;
}

// Themes ordered lightest -> darkest bg, so scrubbing the dial sweeps
// through the palette in a visually coherent order instead of THEMES'
// declaration order.
export const SORTED_THEME_NAMES = [...THEMES]
  .sort(
    (a, b) =>
      themeBgLightness(a.vars['--color-bg'] ?? '#000000') -
      themeBgLightness(b.vars['--color-bg'] ?? '#000000'),
  )
  .map((p) => p.name);

// The dial only blends tokens that can't cause layout reflow - colors,
// button colors, depth, and roundness (border-radius doesn't affect box
// dimensions, so it's safe here unlike spacing/font-size/line-height,
// which are deliberately excluded: continuously blending those during a
// drag is what made the whole page visibly reflow).
const BLEND_VARS = new Set([
  '--color-bg',
  '--color-surface',
  '--color-accent',
  '--color-muted',
  '--color-text',
  '--border-color',
  '--overlay-bg',
  '--link-color',
  '--link-hover',
  '--link-active',
  '--btn-primary-bg',
  '--btn-primary-text',
  '--depth-distance',
  '--depth-blur',
  '--depth-intensity',
  '--depth-contrast',
  '--focus-ring-color',
  '--focus-ring-width',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
]);

// Blends every var the two presets set, key by key: colors mix as colors
// (hex or rgba(), detected by shape), everything else mixes as a plain
// number with its unit preserved.
export function blendThemeVars(
  setVar: (name: string, value: string) => void,
  from: string,
  to: string,
  v: number,
): void {
  const fromTheme = THEMES.find((p) => p.name === from);
  const toTheme = THEMES.find((p) => p.name === to);
  if (!fromTheme || !toTheme) return;
  const t = v / 100;
  const keys = new Set(
    [...Object.keys(fromTheme.vars), ...Object.keys(toTheme.vars)].filter((k) =>
      BLEND_VARS.has(k),
    ),
  );
  for (const key of keys) {
    const a = fromTheme.vars[key];
    const b = toTheme.vars[key];
    if (a === undefined || b === undefined) continue;
    const blendFn =
      isColorValue(a) || isColorValue(b) ? blendColor : blendNumeric;
    setVar(key, blendFn(a, b, t));
  }
}
