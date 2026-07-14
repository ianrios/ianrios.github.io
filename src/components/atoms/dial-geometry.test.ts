import { describe, it, expect } from 'vitest';
import { computeDialLayout } from './dial-geometry';

describe('computeDialLayout', () => {
  it('grows past baseRadius to guarantee the gap when no max is given', () => {
    const { radius, fontScale } = computeDialLayout(9, 90, 80);
    expect(radius).toBeGreaterThan(80);
    expect(fontScale).toBe(1);
  });

  it('leaves layout untouched when it already fits maxFieldSize', () => {
    const unconstrained = computeDialLayout(9, 90, 80);
    const constrained = computeDialLayout(
      9,
      90,
      80,
      unconstrained.fieldSize + 50,
    );
    expect(constrained).toEqual({ ...unconstrained, fontScale: 1 });
  });

  it('shrinks the font just enough to fit a smaller maxFieldSize exactly', () => {
    const maxFieldSize = 260;
    const { fieldSize, fontScale } = computeDialLayout(9, 90, 80, maxFieldSize);
    expect(fieldSize).toBeLessThanOrEqual(maxFieldSize);
    expect(fontScale).toBeLessThan(1);
    expect(fontScale).toBeGreaterThan(0);
  });

  it('never returns a negative or NaN font scale even for a very tight max', () => {
    const { fontScale, fieldSize } = computeDialLayout(9, 90, 80, 50);
    expect(fontScale).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(fontScale)).toBe(true);
    expect(fieldSize).toBeLessThanOrEqual(50);
  });

  it('is a no-op for an empty label set', () => {
    expect(computeDialLayout(0, 0, 80, 200).fontScale).toBe(1);
  });
});
