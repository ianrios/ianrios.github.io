export const hexToRgb = (hex: string): [number, number, number] | null => {
  const h = (hex || '').replace('#', '').trim();
  if (h.length === 3)
    return [
      parseInt(h.charAt(0) + h.charAt(0), 16),
      parseInt(h.charAt(1) + h.charAt(1), 16),
      parseInt(h.charAt(2) + h.charAt(2), 16),
    ];
  if (h.length !== 6) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

export const rgbToHsl = (
  rIn: number,
  gIn: number,
  bIn: number,
): [number, number, number] => {
  const r = rIn / 255;
  const g = gIn / 255;
  const b = bIn / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }
  return [(h / 6) * 360, s, l];
};

export const hslToHex = (hIn: number, s: number, l: number): string => {
  const h = hIn / 360;
  const hue2rgb = (p: number, q: number, tIn: number): number => {
    const t = tIn < 0 ? tIn + 1 : tIn > 1 ? tIn - 1 : tIn;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const isHexColor = (v: string): boolean =>
  typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());

export const isWarmHex = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const [h, s] = rgbToHsl(...rgb);
  return h >= 8 && h <= 50 && s > 0.15;
};

export const desaturateHex = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const [h, s0, l0] = rgbToHsl(...rgb);
  const s = Math.min(0.12, s0 * 0.25);
  const l = Math.min(0.96, l0 + 0.12);
  return hslToHex(h, s, l);
};
