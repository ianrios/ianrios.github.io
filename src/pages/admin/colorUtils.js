export const hexToRgb = (hex) => {
  const h = (hex || "").replace("#", "").trim();
  if (h.length === 3) return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
  if (h.length !== 6) return null;
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};

export const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s, l];
};

export const hslToHex = (h, s, l) => {
  h /= 360;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q-p)*6*t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q-p)*(2/3-t)*6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const q = l < 0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l - q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  const toHex = (x) => Math.round(x*255).toString(16).padStart(2,"0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const isHexColor = (v) => typeof v === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
export const isWarmHex = (hex) => { const rgb = hexToRgb(hex); if (!rgb) return false; const [h,s] = rgbToHsl(...rgb); return h >= 8 && h <= 50 && s > 0.15; };
export const desaturateHex = (hex) => { const rgb = hexToRgb(hex); if (!rgb) return hex; let [h,s,l] = rgbToHsl(...rgb); s = Math.min(0.12, s*0.25); l = Math.min(0.96, l+0.12); return hslToHex(h,s,l); };
