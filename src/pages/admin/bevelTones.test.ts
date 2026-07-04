import { describe, it, expect } from 'vitest';
import { computeBevelTones } from './bevelTones';

// The full set of bevel tone vars computeBevelTones must write into the live
// `vars` map. Keeping this list explicit guards against silently dropping a
// tone key (which leaves a control reading a stale literal).
const BEVEL_KEYS = [
  '--bevel-highlight',
  '--bevel-light',
  '--bevel-shadow',
  '--bevel-dark-shadow',
  '--bevel-surface-highlight',
  '--bevel-surface-light',
  '--bevel-surface-shadow',
  '--bevel-surface-dark-shadow',
];

describe('computeBevelTones', () => {
  it('returns null for an invalid backdrop', () => {
    expect(computeBevelTones('not-a-color', '#0f1a0f')).toBeNull();
    expect(computeBevelTones('#0a0e0a', 'nope')).toBeNull();
  });

  it('writes every bevel tone key', () => {
    const out = computeBevelTones('#0a0e0a', '#0f1a0f');
    expect(out).not.toBeNull();
    expect(Object.keys(out ?? {}).sort()).toEqual([...BEVEL_KEYS].sort());
  });

  it('derives the expected tones for the Terminal theme', () => {
    // bg #0a0e0a and surface #0f1a0f — matches the SCSS bevel-tone() defaults
    // and the token registry. On these very dark colors shadow and dark-shadow
    // both clamp to near-black; the bevel reads via highlight vs dark-shadow.
    const out = computeBevelTones('#0a0e0a', '#0f1a0f');
    expect(out?.['--bevel-highlight']).toBe('#394f39');
    expect(out?.['--bevel-light']).toBe('#1f2c1f');
    expect(out?.['--bevel-shadow']).toBe('#060906');
    expect(out?.['--bevel-dark-shadow']).toBe('#060906');
    expect(out?.['--bevel-surface-highlight']).toBe('#386138');
    expect(out?.['--bevel-surface-light']).toBe('#223a22');
    expect(out?.['--bevel-surface-shadow']).toBe('#060a06');
    expect(out?.['--bevel-surface-dark-shadow']).toBe('#060a06');
  });

  it('highlight is clearly lighter than dark-shadow on a mid surface', () => {
    // A lighter surface separates all four tones (no clamp collapse).
    const out = computeBevelTones('#808080', '#cccccc');
    expect(out?.['--bevel-surface-highlight']).not.toBe(
      out?.['--bevel-surface-dark-shadow'],
    );
    // Solid hex tones, never an rgba/alpha string.
    expect(out?.['--bevel-highlight']).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('defaults to contrast 1 (third arg omitted == explicit 1)', () => {
    const omitted = computeBevelTones('#808080', '#999999');
    const explicit = computeBevelTones('#808080', '#999999', 1);
    expect(omitted).toEqual(explicit);
  });

  it('--depth-contrast widens the tone spread', () => {
    // On a mid backdrop (no clamp collapse) higher contrast pushes the
    // highlight lighter and the dark-shadow darker — a stronger bevel.
    const lum = (contrast: number, k: string) =>
      parseInt(
        (
          computeBevelTones('#808080', '#808080', contrast)?.[k] ?? '#000'
        ).slice(1),
        16,
      );
    const weak = (k: string) => lum(0.5, k);
    const strong = (k: string) => lum(2, k);
    expect(strong('--bevel-highlight')).toBeGreaterThan(
      weak('--bevel-highlight'),
    );
    expect(strong('--bevel-dark-shadow')).toBeLessThan(
      weak('--bevel-dark-shadow'),
    );
  });
});
