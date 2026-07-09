// Position persistence + clamping for FloatingNav, kept pure so the unit
// tests can exercise them directly (jsdom has no pointer-capture APIs, so
// drag itself is verified by hand).

export const NAV_POSITION_KEY = 'nav:v1';

export interface NavPosition {
  x: number;
  y: number;
}

interface Box {
  width: number;
  height: number;
}

export function parseStoredPosition(raw: string | null): NavPosition | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { x, y } = parsed as Record<string, unknown>;
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  } catch {
    return null;
  }
}

/** Keep the panel fully on screen with a small margin on every edge. */
export function clampPosition(
  pos: NavPosition,
  panel: Box,
  viewport: Box,
  margin = 8,
): NavPosition {
  const maxX = Math.max(margin, viewport.width - panel.width - margin);
  const maxY = Math.max(margin, viewport.height - panel.height - margin);
  return {
    x: Math.min(Math.max(pos.x, margin), maxX),
    y: Math.min(Math.max(pos.y, margin), maxY),
  };
}
