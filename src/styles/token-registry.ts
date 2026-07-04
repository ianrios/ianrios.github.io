// Canonical token registry — the single source of truth for design tokens.
// DEFAULTS (adminData), the admin sidebar control lists, and the TokensSection
// specimen view all derive from this manifest. scripts/validate.ts lints every
// :root var, preset key, control, and specimen against it (the drift checks).
//
// One entry per `:root` custom property. A `control` descriptor means the token
// is editable in the admin sidebar; its absence means the token is fixed or
// runtime-derived (e.g. --anim-speed-fast) and lives in the FIXED allow-list.

import type { CSSTokenMap } from '../types/admin';

type ControlType = 'color' | 'range' | 'shadow' | 'ms' | 'pct' | 'angle';

type TokenCategory =
  | 'color'
  | 'link'
  | 'chrome'
  | 'spacing'
  | 'radii'
  | 'font'
  | 'line-height'
  | 'motion'
  | 'layout'
  | 'bevel'
  | 'depth'
  | 'button'
  | 'focus';

interface TokenControl {
  type: ControlType;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface TokenDef {
  cssVar: string;
  category: TokenCategory;
  default: string;
  control?: TokenControl;
}

const color = (label: string): TokenControl => ({ type: 'color', label });
const range = (
  label: string,
  min: number,
  max: number,
  step?: number,
): TokenControl => ({
  type: 'range',
  label,
  min,
  max,
  ...(step ? { step } : {}),
});

// prettier-ignore
export const TOKEN_REGISTRY: TokenDef[] = [
  // ── Colors ──────────────────────────────────────────────────────────────
  { cssVar: '--color-bg', category: 'color', default: '#0a0e0a', control: color('Background') },
  { cssVar: '--color-surface', category: 'color', default: '#0f1a0f', control: color('Surface') },
  { cssVar: '--color-accent', category: 'color', default: '#1a3a1a', control: color('Accent') },
  { cssVar: '--color-muted', category: 'color', default: '#4a7c4a', control: color('Muted') },
  { cssVar: '--color-text', category: 'color', default: '#39ff14', control: color('Text') },
  // ── Chrome (rendered in the Colors sidebar section, no specimen) ─────────
  { cssVar: '--border-color', category: 'chrome', default: 'rgba(128, 128, 128, 0.12)', control: color('Border') },
  { cssVar: '--overlay-bg', category: 'chrome', default: 'rgba(0, 0, 0, 0.55)', control: color('Overlay') },
  // ── Spacing ─────────────────────────────────────────────────────────────
  { cssVar: '--space-xxs', category: 'spacing', default: '4px', control: range('XXS — badge, tiny', 1, 12) },
  { cssVar: '--space-xs', category: 'spacing', default: '8px', control: range('XS — gaps, icons', 2, 20) },
  { cssVar: '--space-sm', category: 'spacing', default: '20px', control: range('SM — input, nav', 4, 48) },
  { cssVar: '--space-md', category: 'spacing', default: '32px', control: range('MD — card pad, gap', 4, 64) },
  { cssVar: '--space-lg', category: 'spacing', default: '56px', control: range('LG — page, btn-lg', 8, 80) },
  { cssVar: '--space-xl', category: 'spacing', default: '64px', control: range('XL — section gap', 8, 128) },
  // ── Radii ───────────────────────────────────────────────────────────────
  { cssVar: '--radius-sm', category: 'radii', default: '8px', control: range('Radius SM', 0, 24) },
  { cssVar: '--radius-md', category: 'radii', default: '16px', control: range('Radius MD', 0, 40) },
  { cssVar: '--radius-lg', category: 'radii', default: '24px', control: range('Radius LG', 0, 48) },
  // ── Typography — font sizes ─────────────────────────────────────────────
  { cssVar: '--font-xxs', category: 'font', default: '10px', control: range('Font xxs', 8, 24) },
  { cssVar: '--font-xs', category: 'font', default: '12px', control: range('Font xs', 8, 28) },
  { cssVar: '--font-sm', category: 'font', default: '14px', control: range('Font sm', 8, 32) },
  { cssVar: '--font-base', category: 'font', default: '16px', control: range('Font base', 10, 40) },
  { cssVar: '--font-lg', category: 'font', default: '18px', control: range('Font lg', 12, 48) },
  // ── Typography — line heights ───────────────────────────────────────────
  { cssVar: '--line-height-base', category: 'line-height', default: '1.5', control: { type: 'pct', label: 'Line height (base)', min: 120, max: 200, step: 5, unit: '%' } },
  { cssVar: '--line-height-loose', category: 'line-height', default: '1.6', control: { type: 'pct', label: 'Line height (loose)', min: 120, max: 200, step: 5, unit: '%' } },
  // ── Motion ──────────────────────────────────────────────────────────────
  { cssVar: '--anim-speed', category: 'motion', default: '0.12s', control: { type: 'ms', label: 'Anim speed', min: 0, max: 800, step: 20, unit: 'ms' } },
  { cssVar: '--anim-speed-slow', category: 'motion', default: '0.5s', control: { type: 'ms', label: 'Anim speed (slow)', min: 0, max: 1500, step: 50, unit: 'ms' } },
  { cssVar: '--anim-speed-fast', category: 'motion', default: '0.06s' }, // derived from --anim-speed in useDesignVars
  // ── Layout ──────────────────────────────────────────────────────────────
  { cssVar: '--sidebar-width', category: 'layout', default: '220px', control: range('Sidebar width', 160, 400, 8) },
  { cssVar: '--drawer-width', category: 'layout', default: '280px', control: range('Drawer width', 160, 400, 8) },
  { cssVar: '--modal-max-width', category: 'layout', default: '700px', control: range('Modal max width', 320, 1200, 20) },
  // ── Bevel tones (Classic Windows 3D) ────────────────────────────────────
  // Solid colors derived from a backdrop by HSL lightness; computeBevelTones
  // re-derives them live, the SCSS bevel-tone() function mirrors them. Derived,
  // not directly editable. The bg-set defaults match #0a0e0a, the surface-set
  // match #0f1a0f (the Terminal default theme).
  { cssVar: '--bevel-highlight', category: 'bevel', default: '#394f39' },
  { cssVar: '--bevel-light', category: 'bevel', default: '#1f2c1f' },
  { cssVar: '--bevel-shadow', category: 'bevel', default: '#060906' },
  { cssVar: '--bevel-dark-shadow', category: 'bevel', default: '#060906' },
  { cssVar: '--bevel-surface-highlight', category: 'bevel', default: '#386138' },
  { cssVar: '--bevel-surface-light', category: 'bevel', default: '#223a22' },
  { cssVar: '--bevel-surface-shadow', category: 'bevel', default: '#060a06' },
  { cssVar: '--bevel-surface-dark-shadow', category: 'bevel', default: '#060a06' },
  // ── Depth (parametric bevel geometry; editable, no specimen) ─────────────
  // distance/blur are px; intensity is alpha 0–1; contrast scales the
  // bevel-tone lightness delta. blur 0 = hard bevel, higher = soft neu.
  { cssVar: '--depth-distance', category: 'depth', default: '2px', control: range('Distance', 0, 8) },
  { cssVar: '--depth-blur', category: 'depth', default: '3px', control: range('Blur (0 = hard)', 0, 24) },
  { cssVar: '--depth-intensity', category: 'depth', default: '0.6', control: range('Intensity', 0, 1, 0.05) },
  { cssVar: '--depth-contrast', category: 'depth', default: '1', control: range('Contrast', 0.5, 2, 0.05) },
  // ── Buttons ─────────────────────────────────────────────────────────────
  { cssVar: '--btn-primary-bg', category: 'button', default: '#39ff14', control: color('Primary fill') },
  { cssVar: '--btn-primary-text', category: 'button', default: '#060e06', control: color('Primary text') },
  { cssVar: '--btn-radius', category: 'button', default: '12px', control: range('Radius', 0, 50) },
  { cssVar: '--btn-padding-y', category: 'button', default: '16px', control: range('Padding Y', 0, 24) },
  { cssVar: '--btn-padding-x', category: 'button', default: '40px', control: range('Padding X', 0, 64) },
  { cssVar: '--clickable-border-width', category: 'button', default: '1px', control: range('Outline width', 0, 4) },
  // ── Focus ───────────────────────────────────────────────────────────────
  { cssVar: '--focus-ring-color', category: 'focus', default: 'rgba(57,255,20,0.15)', control: color('Focus ring') },
  { cssVar: '--focus-ring-width', category: 'focus', default: '4px', control: range('Ring width', 0, 12) },
  // ── Links ───────────────────────────────────────────────────────────────
  { cssVar: '--link-color', category: 'link', default: '#00ffaa', control: color('Default (anchors)') },
  { cssVar: '--link-hover', category: 'link', default: '#fff800', control: color('Hover') },
  { cssVar: '--link-active', category: 'link', default: '#ff3300', control: color('Active') },
  { cssVar: '--link-primary-color', category: 'link', default: '#39ff14', control: color('Primary link') },
];

// Specimen categories rendered (one group each) in TokensSection. Tokens whose
// category is here must appear in the specimen view ([token-specimen] check).
export const SPECIMEN_CATEGORIES: TokenCategory[] = [
  'color',
  'link',
  'font',
  'spacing',
  'radii',
  'motion',
  'bevel',
];

// Specimen exceptions — tokens that cannot render as a visual swatch.
export const SPECIMEN_ALLOWLIST: string[] = [];

// min/max are always numbers so the list can drive the typed RangeControl;
// color controls carry harmless 0s the renderer ignores.
interface DerivedControl {
  varName: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

/** Controls in a category, optionally narrowed to one control type. */
export function controlList(
  category: TokenCategory,
  type?: ControlType,
): DerivedControl[] {
  const out: DerivedControl[] = [];
  for (const t of TOKEN_REGISTRY) {
    const c = t.control;
    if (!c || t.category !== category) continue;
    if (type && c.type !== type) continue;
    out.push({
      varName: t.cssVar,
      label: c.label,
      min: c.min ?? 0,
      max: c.max ?? 0,
      ...(c.step !== undefined ? { step: c.step } : {}),
      ...(c.unit !== undefined ? { unit: c.unit } : {}),
    });
  }
  return out;
}

/** The control descriptor for a single token, for bespoke sliders. */
export function getControl(cssVar: string): TokenControl | undefined {
  return TOKEN_REGISTRY.find((t) => t.cssVar === cssVar)?.control;
}

/** cssVars in a category, in registry order — drives the specimen view. */
export function categoryVars(category: TokenCategory): string[] {
  return TOKEN_REGISTRY.filter((t) => t.category === category).map(
    (t) => t.cssVar,
  );
}

/** Default value map for every token — the source for adminData.DEFAULTS. */
export const REGISTRY_DEFAULTS: CSSTokenMap = Object.fromEntries(
  TOKEN_REGISTRY.map((t) => [t.cssVar, t.default]),
);
