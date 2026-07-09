import { describe, it, expect } from 'vitest';
import { blendColor, blendNumeric, isColorValue } from './themeInterpolate';

describe('isColorValue', () => {
  it('detects hex colors', () => {
    expect(isColorValue('#ffffff')).toBe(true);
    expect(isColorValue('#fff')).toBe(true);
  });

  it('detects rgba/rgb colors', () => {
    expect(isColorValue('rgba(255,255,255,0.6)')).toBe(true);
    expect(isColorValue('rgba(0, 0, 0, 0.85)')).toBe(true);
    expect(isColorValue('rgb(1, 2, 3)')).toBe(true);
  });

  it('rejects numeric-with-unit values', () => {
    expect(isColorValue('2px')).toBe(false);
    expect(isColorValue('0.1s')).toBe(false);
    expect(isColorValue('400')).toBe(false);
  });
});

describe('blendColor', () => {
  it('reproduces the "from" endpoint exactly at t=0', () => {
    expect(blendColor('#000000', '#ffffff', 0)).toBe('#000000');
    expect(blendColor('rgba(1,2,3,0.5)', '#ffffff', 0)).toBe('rgba(1,2,3,0.5)');
  });

  it('reproduces the "to" endpoint exactly at t=1', () => {
    expect(blendColor('#000000', '#ffffff', 1)).toBe('#ffffff');
    expect(blendColor('#000000', 'rgba(9,9,9,0.2)', 1)).toBe('rgba(9,9,9,0.2)');
  });

  it('blends two hex colors at the midpoint', () => {
    expect(blendColor('#000000', '#ffffff', 0.5)).toBe(
      'rgba(128, 128, 128, 1)',
    );
  });

  it('blends hex against rgba, including alpha', () => {
    // #000000 (opaque black) -> rgba(255,255,255,0) (transparent white)
    expect(blendColor('#000000', 'rgba(255,255,255,0)', 0.5)).toBe(
      'rgba(128, 128, 128, 0.5)',
    );
  });

  it('blends rgba against rgba with spaced-comma formatting', () => {
    expect(blendColor('rgba(0, 0, 0, 0)', 'rgba(100, 100, 100, 1)', 0.5)).toBe(
      'rgba(50, 50, 50, 0.5)',
    );
  });

  it('blends a value against itself back to the same value', () => {
    expect(blendColor('#4da6ff', '#4da6ff', 0)).toBe('#4da6ff');
    expect(blendColor('#4da6ff', '#4da6ff', 1)).toBe('#4da6ff');
    expect(blendColor('#4da6ff', '#4da6ff', 0.5)).toBe('rgba(77, 166, 255, 1)');
  });
});

describe('blendNumeric', () => {
  it('reproduces the "from" endpoint exactly at t=0', () => {
    expect(blendNumeric('2px', '8px', 0)).toBe('2px');
  });

  it('reproduces the "to" endpoint exactly at t=1', () => {
    expect(blendNumeric('2px', '8px', 1)).toBe('8px');
  });

  it('blends px values linearly', () => {
    expect(blendNumeric('0px', '8px', 0.5)).toBe('4px');
  });

  it('blends s (seconds) values linearly', () => {
    expect(blendNumeric('0.5s', '0.1s', 0.5)).toBe('0.3s');
  });

  it('blends unitless values linearly', () => {
    expect(blendNumeric('400', '900', 0.5)).toBe('650');
    expect(blendNumeric('1.5', '1.7', 0.5)).toBe('1.6');
  });

  it('blends a value against itself back to the same value', () => {
    expect(blendNumeric('4px', '4px', 0)).toBe('4px');
    expect(blendNumeric('4px', '4px', 1)).toBe('4px');
    expect(blendNumeric('4px', '4px', 0.5)).toBe('4px');
  });
});
