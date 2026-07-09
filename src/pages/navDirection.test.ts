import { describe, it, expect } from 'vitest';
import { computeNavDelta, applyNavDirection } from './navDirection';

describe('computeNavDelta', () => {
  it('pans right one cell from home to the design system', () => {
    expect(computeNavDelta('/', '/design-system')).toEqual({ dx: 1, dy: 0 });
  });

  it('pans two cells for the design-system to metaballs hop', () => {
    expect(computeNavDelta('/design-system', '/metaballs')).toEqual({
      dx: -2,
      dy: 0,
    });
  });

  it('pans up to about and back down', () => {
    expect(computeNavDelta('/', '/about')).toEqual({ dx: 0, dy: -1 });
    expect(computeNavDelta('/about', '/')).toEqual({ dx: 0, dy: 1 });
  });

  it('returns null when either route is unmapped', () => {
    expect(computeNavDelta('/nope', '/')).toBeNull();
    expect(computeNavDelta('/', '/nope')).toBeNull();
  });
});

describe('applyNavDirection', () => {
  it('writes the vector to the html element and reports true', () => {
    expect(applyNavDirection('/about', '/design-system')).toBe(true);
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--nav-dx')).toBe('1');
    expect(style.getPropertyValue('--nav-dy')).toBe('1');
  });

  it('reports false for unmapped routes and for a same-cell move', () => {
    expect(applyNavDirection('/', '/nope')).toBe(false);
    expect(applyNavDirection('/', '/')).toBe(false);
  });
});
