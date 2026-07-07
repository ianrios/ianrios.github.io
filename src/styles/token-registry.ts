// Canonical token registry — the single source of truth for design tokens.
// DEFAULTS (adminData), the admin sidebar control lists, and the TokensSection
// specimen view all derive from this manifest. scripts/validate.ts lints every
// :root var, preset key, control, and specimen against it (the drift checks).
//
// One entry per `:root` custom property. A `control` descriptor means the token
// is editable in the admin sidebar; its absence means the token is fixed or
// runtime-derived (e.g. --anim-speed-fast) and lives in the FIXED allow-list.
//
// Default values equal THEMES[DEFAULT_THEME] (High Contrast) and the literal
// SCSS first-paint values — enforced by the [default-value-sync] drift check.
// To change the default theme: edit DEFAULT_THEME in adminData.ts and let the
// check list every value here and in _tokens.scss/_base.scss that must follow.

import type { CSSTokenMap } from '../types/admin';

type ControlType = 'color' | 'range' | 'ms' | 'pct' | 'raw';

type TokenCategory =
  | 'color'
  | 'link'
  | 'chrome'
  | 'spacing'
  | 'radii'
  | 'font'
  | 'font-family'
  | 'font-weight'
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
  { cssVar: '--color-bg', category: 'color', default: '#000000', control: color('Background') },
  { cssVar: '--color-surface', category: 'color', default: '#101010', control: color('Surface') },
  { cssVar: '--color-accent', category: 'color', default: '#1f1f1f', control: color('Accent') },
  { cssVar: '--color-muted', category: 'color', default: '#c0c0c0', control: color('Muted') },
  { cssVar: '--color-text', category: 'color', default: '#ffffff', control: color('Text') },
  // ── Chrome (rendered in the Colors sidebar section, no specimen) ─────────
  { cssVar: '--border-color', category: 'chrome', default: 'rgba(255,255,255,0.6)', control: color('Border') },
  { cssVar: '--overlay-bg', category: 'chrome', default: 'rgba(0,0,0,0.85)', control: color('Overlay') },
  // ── Spacing ─────────────────────────────────────────────────────────────
  { cssVar: '--space-xxs', category: 'spacing', default: '4px', control: range('XXS: badge, tiny', 1, 12) },
  { cssVar: '--space-xs', category: 'spacing', default: '8px', control: range('XS: gaps, icons', 2, 20) },
  { cssVar: '--space-sm', category: 'spacing', default: '16px', control: range('SM: input, nav', 4, 48) },
  { cssVar: '--space-md', category: 'spacing', default: '24px', control: range('MD: card pad, gap', 4, 64) },
  { cssVar: '--space-lg', category: 'spacing', default: '40px', control: range('LG: page, btn-lg', 8, 80) },
  { cssVar: '--space-xl', category: 'spacing', default: '56px', control: range('XL: section gap', 8, 128) },
  // ── Radii ───────────────────────────────────────────────────────────────
  { cssVar: '--radius-sm', category: 'radii', default: '0px', control: range('Radius SM', 0, 24) },
  { cssVar: '--radius-md', category: 'radii', default: '0px', control: range('Radius MD', 0, 40) },
  { cssVar: '--radius-lg', category: 'radii', default: '0px', control: range('Radius LG', 0, 48) },
  // ── Font families (fixed; no control until more fonts exist) ────────────
  { cssVar: '--font-family-base', category: 'font-family', default: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
  { cssVar: '--font-family-display', category: 'font-family', default: "'Montserrat', sans-serif" },
  // ── Typography — font sizes ─────────────────────────────────────────────
  { cssVar: '--font-xxs', category: 'font', default: '12px', control: range('Font xxs', 8, 24) },
  { cssVar: '--font-xs', category: 'font', default: '14px', control: range('Font xs', 8, 28) },
  { cssVar: '--font-sm', category: 'font', default: '16px', control: range('Font sm', 8, 32) },
  { cssVar: '--font-base', category: 'font', default: '18px', control: range('Font base', 10, 40) },
  { cssVar: '--font-lg', category: 'font', default: '22px', control: range('Font lg', 12, 48) },
  { cssVar: '--font-xl', category: 'font', default: '28px', control: range('Font xl', 14, 56) },
  // ── Typography — font weights (Heading uses -heading, Text uses -base) ──
  { cssVar: '--font-weight-base', category: 'font-weight', default: '400', control: { type: 'raw', label: 'Weight (base)', min: 100, max: 900, step: 100 } },
  { cssVar: '--font-weight-heading', category: 'font-weight', default: '700', control: { type: 'raw', label: 'Weight (heading)', min: 100, max: 900, step: 100 } },
  // ── Typography — line heights ───────────────────────────────────────────
  { cssVar: '--line-height-base', category: 'line-height', default: '1.5', control: { type: 'pct', label: 'Line height (base)', min: 120, max: 200, step: 5, unit: '%' } },
  { cssVar: '--line-height-loose', category: 'line-height', default: '1.6', control: { type: 'pct', label: 'Line height (loose)', min: 120, max: 200, step: 5, unit: '%' } },
  // ── Motion ──────────────────────────────────────────────────────────────
  { cssVar: '--anim-speed', category: 'motion', default: '0.1s', control: { type: 'ms', label: 'Anim speed', min: 0, max: 800, step: 20, unit: 'ms' } },
  { cssVar: '--anim-speed-slow', category: 'motion', default: '0.3s', control: { type: 'ms', label: 'Anim speed (slow)', min: 0, max: 1500, step: 50, unit: 'ms' } },
  { cssVar: '--anim-speed-fast', category: 'motion', default: '0.05s' }, // derived: --anim-speed * 0.5 in useDesignVars
  // ── Layout ──────────────────────────────────────────────────────────────
  { cssVar: '--sidebar-width', category: 'layout', default: '220px', control: range('Sidebar width', 160, 400, 8) },
  { cssVar: '--drawer-width', category: 'layout', default: '280px', control: range('Drawer width', 160, 400, 8) },
  { cssVar: '--modal-max-width', category: 'layout', default: '700px', control: range('Modal max width', 320, 1200, 20) },
  // ── Bevel tones (Classic Windows 3D) ────────────────────────────────────
  // Solid colors derived from a backdrop by HSL lightness; resolveVars
  // re-derives them live, the SCSS bevel-tone() function mirrors them. Derived,
  // not directly editable. These defaults are computeBevelTones('#000000',
  // '#101010', 2) — the High Contrast bg/surface/contrast.
  { cssVar: '--bevel-highlight', category: 'bevel', default: '#707070' },
  { cssVar: '--bevel-light', category: 'bevel', default: '#333333' },
  { cssVar: '--bevel-shadow', category: 'bevel', default: '#080808' },
  { cssVar: '--bevel-dark-shadow', category: 'bevel', default: '#080808' },
  { cssVar: '--bevel-surface-highlight', category: 'bevel', default: '#808080' },
  { cssVar: '--bevel-surface-light', category: 'bevel', default: '#434343' },
  { cssVar: '--bevel-surface-shadow', category: 'bevel', default: '#080808' },
  { cssVar: '--bevel-surface-dark-shadow', category: 'bevel', default: '#080808' },
  // ── Depth (parametric bevel geometry; editable, no specimen) ─────────────
  // distance/blur are px; intensity is alpha 0–1; contrast scales the
  // bevel-tone lightness delta. blur 0 = hard bevel, higher = soft neu.
  { cssVar: '--depth-distance', category: 'depth', default: '2px', control: range('Distance', 0, 8) },
  { cssVar: '--depth-blur', category: 'depth', default: '0px', control: range('Blur (0 = hard)', 0, 24) },
  { cssVar: '--depth-intensity', category: 'depth', default: '1', control: { type: 'raw', label: 'Intensity', min: 0, max: 1, step: 0.05 } },
  { cssVar: '--depth-contrast', category: 'depth', default: '2', control: { type: 'raw', label: 'Contrast', min: 0.5, max: 2, step: 0.05 } },
  // ── Buttons ─────────────────────────────────────────────────────────────
  { cssVar: '--btn-primary-bg', category: 'button', default: '#ffe000', control: color('Primary fill') },
  { cssVar: '--btn-primary-text', category: 'button', default: '#000000', control: color('Primary text') },
  { cssVar: '--btn-radius', category: 'button', default: '0px', control: range('Radius', 0, 50) },
  { cssVar: '--btn-padding-y', category: 'button', default: '10px', control: range('Padding Y', 0, 24) },
  { cssVar: '--btn-padding-x', category: 'button', default: '24px', control: range('Padding X', 0, 64) },
  { cssVar: '--clickable-border-width', category: 'button', default: '1px', control: range('Outline width', 0, 4) },
  // ── Focus ───────────────────────────────────────────────────────────────
  { cssVar: '--focus-ring-color', category: 'focus', default: '#ffff00', control: color('Focus ring') },
  { cssVar: '--focus-ring-width', category: 'focus', default: '4px', control: range('Ring width', 0, 12) },
  // ── Links (three states: rest, hover, active/click) ─────────────────────
  { cssVar: '--link-color', category: 'link', default: '#4da6ff', control: color('Default') },
  { cssVar: '--link-hover', category: 'link', default: '#ffff00', control: color('Hover') },
  { cssVar: '--link-active', category: 'link', default: '#ff6666', control: color('Active') },
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
