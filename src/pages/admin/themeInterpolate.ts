// Pure blend helpers for PresetDial's theme-blend dial: given two token values
// from two different theme presets and a 0-1 position, produce the value at
// that position. No React/DesignVars coupling here so both functions are
// trivially unit-testable in isolation.
//
// Token values in THEMES (adminData.ts) are only ever colors (hex or rgba())
// or numbers with an optional unit suffix (px/s/% or none) - never mixed.
// blendColor/blendNumeric assume their inputs match one of those two shapes;
// callers pick which to call via isColorValue.

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGBA_RE =
  /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;

/**
 * True for `#hex` and `rgb(...)`/`rgba(...)` strings - the shapes THEMES
 * uses for color tokens.
 */
export function isColorValue(value: string): boolean {
  const v = value.trim();
  return HEX_RE.test(v) || RGBA_RE.test(v);
}

function parseColor(value: string): RGBA | null {
  const v = value.trim();
  const hex = HEX_RE.exec(v);
  if (hex) {
    const h = hex[1] ?? '';
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgba = RGBA_RE.exec(v);
  if (rgba) {
    return {
      r: Number(rgba[1] ?? 0),
      g: Number(rgba[2] ?? 0),
      b: Number(rgba[3] ?? 0),
      a: rgba[4] !== undefined ? Number(rgba[4]) : 1,
    };
  }
  return null;
}

/**
 * Blend two color strings (hex or rgba, either combination) at t (0-1).
 * Always serializes to rgba(...) since CSS accepts it wherever a color is
 * valid and it's the only format that round-trips alpha for both inputs.
 * t=0/t=1 return the original endpoint string unchanged (bit-exact), so
 * dragging the dial fully to one side reproduces that theme's own value
 * with no residual float noise.
 */
export function blendColor(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return t < 0.5 ? a : b;
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bch = Math.round(ca.b + (cb.b - ca.b) * t);
  const alpha = Math.round((ca.a + (cb.a - ca.a) * t) * 1000) / 1000;
  return `rgba(${r}, ${g}, ${bch}, ${alpha})`;
}

const NUMERIC_RE = /^(-?\d*\.?\d+)(.*)$/;

/**
 * Blend two "number + optional unit" strings (`2px`, `0.1s`, `400`, `1.5`)
 * at t (0-1). Preserves the trailing unit suffix; t=0/t=1 return the
 * original endpoint string unchanged (bit-exact).
 */
export function blendNumeric(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ma = NUMERIC_RE.exec(a.trim());
  const mb = NUMERIC_RE.exec(b.trim());
  if (!ma || !mb) return t < 0.5 ? a : b;
  const na = parseFloat(ma[1] ?? '0');
  const nb = parseFloat(mb[1] ?? '0');
  const unit = ma[2] ?? mb[2] ?? '';
  const value = Math.round((na + (nb - na) * t) * 1000) / 1000;
  return `${value}${unit}`;
}
