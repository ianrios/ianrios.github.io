// Papers-on-a-table direction map: every route occupies a fixed cell on a
// virtual table (x grows rightward, y grows downward, one cell = one
// viewport). Navigation pans the full cell delta, so a two-cell hop
// travels twice as far - direction is data, not UI (concepts doc s.8).

export interface TableDelta {
  dx: number;
  dy: number;
}

const ROUTE_POSITIONS: Record<string, { x: number; y: number }> = {
  '/': { x: 0, y: 0 },
  '/about': { x: 0, y: -1 },
  '/contact': { x: 0, y: 1 },
  '/design-system': { x: 1, y: 0 },
  '/metaballs': { x: -1, y: 0 },
};

/** Cell delta between two mapped routes; null when either is unmapped. */
export function computeNavDelta(from: string, to: string): TableDelta | null {
  const a = ROUTE_POSITIONS[from];
  const b = ROUTE_POSITIONS[to];
  if (!a || !b) return null;
  return { dx: b.x - a.x, dy: b.y - a.y };
}

/**
 * Write the pan vector to <html> for the ::view-transition keyframes.
 * Deliberately NOT :root tokens: transient JS state with no control or
 * specimen semantics (same class as the JS-computed bevel tones).
 * Returns false when no direction applies (unmapped route or no move).
 */
export function applyNavDirection(from: string, to: string): boolean {
  const delta = computeNavDelta(from, to);
  if (delta === null || (delta.dx === 0 && delta.dy === 0)) return false;
  document.documentElement.style.setProperty('--nav-dx', `${delta.dx}`);
  document.documentElement.style.setProperty('--nav-dy', `${delta.dy}`);
  return true;
}
