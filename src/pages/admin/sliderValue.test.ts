import { describe, it, expect } from 'vitest';
import { msVal, pctVal, numVal } from './sliderValue';
import { getControl } from '../../styles/token-registry';

// Regression guard for the motion-slider snap-back bug: a value parsing to 0
// must survive (the old `parseFloat(...) || fallback` reverted it to default).
describe('msVal — seconds string → slider ms', () => {
  it('keeps a true 0 instead of reverting to the fallback', () => {
    expect(msVal('0s', 0.12)).toBe(0);
  });

  it('keeps low non-zero values', () => {
    expect(msVal('0.02s', 0.12)).toBe(20);
  });

  it('round-trips the default', () => {
    expect(msVal('0.12s', 0.12)).toBe(120);
  });

  it('falls back when the value is missing or unparseable', () => {
    expect(msVal(undefined, 0.12)).toBe(120);
    expect(msVal('', 0.12)).toBe(120);
    expect(msVal('abc', 0.12)).toBe(120);
  });
});

describe('pctVal — ratio string → slider percent', () => {
  it('keeps a true 0 instead of reverting to the fallback', () => {
    expect(pctVal('0', 1.5)).toBe(0);
  });

  it('converts a ratio to a percentage', () => {
    expect(pctVal('1.2', 1.5)).toBe(120);
  });

  it('falls back when the value is missing or unparseable', () => {
    expect(pctVal(undefined, 1.5)).toBe(150);
    expect(pctVal('', 1.5)).toBe(150);
  });
});

describe('numVal — raw number (px stripped, decimals kept)', () => {
  it('keeps a true 0 instead of reverting to the fallback', () => {
    // depth-intensity dragged to the far left must hold at 0.
    expect(numVal('0', 0.6)).toBe(0);
  });

  it('keeps decimal and px-suffixed values', () => {
    expect(numVal('0.05', 0.6)).toBe(0.05);
    expect(numVal('0px', 2)).toBe(0);
    expect(numVal('220px', 2)).toBe(220);
  });

  it('falls back when the value is missing or unparseable', () => {
    expect(numVal(undefined, 0.6)).toBe(0.6);
    expect(numVal('', 0.6)).toBe(0.6);
    expect(numVal('abc', 0.6)).toBe(0.6);
  });
});

// Secondary half of the snap-back fix: the default value must land on the
// slider's step grid, otherwise the thumb cannot reach it.
describe('motion control grid', () => {
  it('puts the --anim-speed 120ms default on a step', () => {
    const c = getControl('--anim-speed');
    const step = c?.step ?? 1;
    expect(120 % step).toBe(0);
  });
});
