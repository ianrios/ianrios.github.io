import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingNav } from './FloatingNav';
import { clampPosition, parseStoredPosition } from './floatingNav';

describe('parseStoredPosition', () => {
  it('returns null for absent, malformed, or wrong-shaped values', () => {
    expect(parseStoredPosition(null)).toBeNull();
    expect(parseStoredPosition('not json')).toBeNull();
    expect(parseStoredPosition('"a string"')).toBeNull();
    expect(parseStoredPosition('{"x": 1}')).toBeNull();
    expect(parseStoredPosition('{"x": "1", "y": "2"}')).toBeNull();
    expect(parseStoredPosition('{"x": null, "y": 2}')).toBeNull();
  });

  it('rejects non-finite coordinates', () => {
    expect(parseStoredPosition('{"x": 1e999, "y": 2}')).toBeNull();
  });

  it('returns a valid stored position', () => {
    expect(parseStoredPosition('{"x": 12, "y": 34}')).toEqual({ x: 12, y: 34 });
  });
});

describe('clampPosition', () => {
  const panel = { width: 200, height: 100 };
  const viewport = { width: 1000, height: 800 };

  it('leaves an on-screen position unchanged', () => {
    expect(clampPosition({ x: 300, y: 300 }, panel, viewport)).toEqual({
      x: 300,
      y: 300,
    });
  });

  it('clamps negative coordinates to the margin', () => {
    expect(clampPosition({ x: -50, y: -50 }, panel, viewport)).toEqual({
      x: 8,
      y: 8,
    });
  });

  it('clamps past the right/bottom edges so the panel stays visible', () => {
    expect(clampPosition({ x: 5000, y: 5000 }, panel, viewport)).toEqual({
      x: 1000 - 200 - 8,
      y: 800 - 100 - 8,
    });
  });

  it('never inverts when the panel is larger than the viewport', () => {
    const out = clampPosition({ x: 50, y: 50 }, { width: 500, height: 500 }, {
      width: 300,
      height: 300,
    });
    expect(out).toEqual({ x: 8, y: 8 });
  });
});

describe('FloatingNav', () => {
  it('renders an accessible nav with a grip and its children', () => {
    render(
      <FloatingNav inline>
        <button>home</button>
      </FloatingNav>,
    );
    expect(screen.getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /move navigation/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'home' })).toBeInTheDocument();
  });
});
