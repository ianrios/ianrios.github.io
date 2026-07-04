// Pure converters between a CSS token string and its integer slider position.
// Use a finite-check, not `|| fallback`: a parsed value of 0 is falsy, so the
// old `parseFloat(...) || fallback` reverted true 0 / low values to the default
// (the motion-slider snap-back bug).

export function msVal(raw: string | undefined, fallback: number): number {
  const parsed = parseFloat(raw ?? '');
  return Math.round((Number.isFinite(parsed) ? parsed : fallback) * 1000);
}

export function pctVal(raw: string | undefined, fallback: number): number {
  const parsed = parseFloat(raw ?? '');
  return Math.round((Number.isFinite(parsed) ? parsed : fallback) * 100);
}

// Raw numeric position (px stripped, decimals kept). Same finite-check so a
// legit 0 (e.g. depth-intensity at the far left) holds, not snaps back.
export function numVal(raw: string | undefined, fallback: number): number {
  const parsed = parseFloat(raw ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
}
