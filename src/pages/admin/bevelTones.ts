// Backdrop→bevel-tone derivation — the JS twin of the SCSS bevel-tone()
// function in _tokens.scss. Both MUST stay in sync (same lightness deltas and
// clamp) so JS re-derivation never jumps away from the SCSS first-paint
// defaults. Given the page background and the card surface, returns the eight
// SOLID bevel tone colors (Classic Windows 3D bevel) as CSS custom-property
// values, ready to merge into the live `vars` map.
import type { CSSTokenMap } from '../../types/admin';
import { hexToRgb, rgbToHsl, hslToHex } from './colorUtils';

// Base lightness deltas (absolute, in 0..1 HSL space), clamped to [0.03, 0.97]:
//   highlight +0.22 · light +0.10 · shadow -0.10 · dark-shadow -0.20
// Each delta is multiplied by `contrast` (the --depth-contrast var) so stronger
// contrast pushes the tones further from the backdrop. Mirrors the SCSS
// bevel-tone($c, $delta, $contrast) third argument; default 1 = unchanged.
const clampL = (l: number): number => Math.min(Math.max(l, 0.03), 0.97);

interface ToneSet {
  highlight: string;
  light: string;
  shadow: string;
  darkShadow: string;
}

function toneSet(hex: string, contrast: number): ToneSet | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  return {
    highlight: hslToHex(h, s, clampL(l + 0.22 * contrast)),
    light: hslToHex(h, s, clampL(l + 0.1 * contrast)),
    shadow: hslToHex(h, s, clampL(l - 0.1 * contrast)),
    darkShadow: hslToHex(h, s, clampL(l - 0.2 * contrast)),
  };
}

export function computeBevelTones(
  bgHex: string,
  surfaceHex: string,
  contrast = 1,
): CSSTokenMap | null {
  const bg = toneSet(bgHex, contrast);
  const surface = toneSet(surfaceHex, contrast);
  if (!bg || !surface) return null;
  return {
    '--bevel-highlight': bg.highlight,
    '--bevel-light': bg.light,
    '--bevel-shadow': bg.shadow,
    '--bevel-dark-shadow': bg.darkShadow,
    '--bevel-surface-highlight': surface.highlight,
    '--bevel-surface-light': surface.light,
    '--bevel-surface-shadow': surface.shadow,
    '--bevel-surface-dark-shadow': surface.darkShadow,
  };
}
