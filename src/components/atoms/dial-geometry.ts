// Pure geometry for Dial, kept separate so the component stays focused on
// rendering/interaction and this stays trivially unit-testable.

export const mod = (n: number, m: number): number => ((n % m) + m) % m;

// Angle in degrees, clockwise from 12 o'clock, from `center` to `point`.
// atan2(dx, -dy) rather than the usual atan2(dy, dx): flips to a
// clockwise-from-up convention so 0deg = top, 90deg = right, 180deg = bottom.
export function pointerAngle(
  center: { x: number; y: number },
  point: { x: number; y: number },
): number {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

// Shortest signed angular step from `a` to `b`, in (-180, 180]. Used to
// accumulate rotation frame-to-frame instead of re-deriving an absolute
// angle each move, which is what avoids the classic 359deg -> 0deg jump
// when a drag crosses the atan2 wraparound.
export function angleDelta(a: number, b: number): number {
  return mod(b - a + 180, 360) - 180;
}

// Guaranteed clearance between adjacent labels' edges - the gap is fixed
// "no matter what" rather than a size that merely happens to fit one
// particular label set.
const LABEL_GAP_PX = 6;
const FIELD_PADDING_PX = 8;

export interface DialLayout {
  radius: number;
  fieldSize: number;
  /** 1 = labels at their natural size; <1 = shrunk to fit maxFieldSize. */
  fontScale: number;
}

function layoutAt(
  count: number,
  labelWidth: number,
  baseRadius: number,
): { radius: number; fieldSize: number } {
  const needed = ((labelWidth + LABEL_GAP_PX) * count) / (2 * Math.PI);
  const radius = Math.max(baseRadius, needed);
  const fieldSize = Math.ceil(2 * (radius + labelWidth / 2 + FIELD_PADDING_PX));
  return { radius, fieldSize };
}

// Grows the label radius (and the square field that contains it) to
// guarantee LABEL_GAP_PX between every pair of neighbors, same as before.
// New: when a `maxFieldSize` is given and the natural layout would exceed
// it, solves directly for the label width (and matching font scale) that
// hits maxFieldSize exactly, instead of either overflowing the container
// or clamping the radius and letting labels collide - the container's
// real available width and the zero-overlap guarantee both hold, at the
// cost of a smaller label font when there truly isn't room for the
// original size. fieldSize is linear in labelWidth once radius is past
// its baseRadius floor (which it is whenever shrinking triggers at all),
// so this is an exact solve, not an iterative approximation.
export function computeDialLayout(
  count: number,
  maxLabelWidth: number,
  baseRadius: number,
  maxFieldSize?: number,
): DialLayout {
  const full = layoutAt(count, maxLabelWidth, baseRadius);
  if (
    maxFieldSize === undefined ||
    full.fieldSize <= maxFieldSize ||
    maxLabelWidth <= 0 ||
    count <= 0
  ) {
    return { ...full, fontScale: 1 };
  }
  const k = count / (2 * Math.PI);
  const targetLabelWidth =
    (maxFieldSize / 2 - FIELD_PADDING_PX - LABEL_GAP_PX * k) / (k + 0.5);
  const clampedLabelWidth = Math.max(0, targetLabelWidth);
  const fontScale = clampedLabelWidth / maxLabelWidth;
  const scaled = layoutAt(count, clampedLabelWidth, baseRadius);
  return {
    radius: scaled.radius,
    fieldSize: Math.min(scaled.fieldSize, maxFieldSize),
    fontScale,
  };
}
