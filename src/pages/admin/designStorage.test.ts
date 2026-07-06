// jsdom provides window.localStorage; each test starts from a clean slate.
import { describe, it, expect, beforeEach } from 'vitest';
import { REGISTRY_DEFAULTS } from '../../styles/token-registry';
import { THEMES, DEFAULT_THEME } from './adminData';
import {
  STORAGE_KEY,
  isStoredDesign,
  filterEditable,
  loadStoredDesign,
  persistDesign,
  clearStoredDesign,
} from './designStorage';

const LEGACY_KEY = 'skeuomorph:vars';

beforeEach(() => {
  window.localStorage.clear();
});

describe('isStoredDesign', () => {
  it('accepts a valid payload and rejects malformed ones', () => {
    expect(
      isStoredDesign({ version: 1, theme: null, overrides: {}, snapshot: {} }),
    ).toBe(true);
    expect(isStoredDesign(null)).toBe(false);
    expect(isStoredDesign({ version: 2, theme: null, overrides: {} })).toBe(
      false,
    );
    expect(
      isStoredDesign({
        version: 1,
        theme: 'Glow',
        overrides: { '--color-bg': 7 },
        snapshot: {},
      }),
    ).toBe(false);
  });
});

describe('filterEditable', () => {
  it('drops unknown, non-editable, and empty entries', () => {
    const out = filterEditable({
      '--color-bg': ' #123456 ',
      '--btn-gradient-end': '#ff0000', // purged token: must not survive
      '--bevel-highlight': '#ffffff', // derived: not editable
      '--color-text': '   ',
    });
    expect(out).toEqual({ '--color-bg': '#123456' });
  });
});

describe('loadStoredDesign', () => {
  it('returns null for a clean visitor', () => {
    expect(loadStoredDesign(THEMES)).toBeNull();
  });

  it('round-trips theme + overrides', () => {
    persistDesign(
      { theme: 'Glow', overrides: { '--color-bg': '#111111' } },
      { ...REGISTRY_DEFAULTS },
    );
    expect(loadStoredDesign(THEMES)).toEqual({
      theme: 'Glow',
      overrides: { '--color-bg': '#111111' },
    });
  });

  it('rejects a stored theme that no longer exists', () => {
    persistDesign(
      { theme: 'Retired Theme', overrides: { '--color-bg': '#111111' } },
      {},
    );
    expect(loadStoredDesign(THEMES)).toBeNull();
  });

  it('drops corrupt JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadStoredDesign(THEMES)).toBeNull();
  });

  it('migrates a legacy untouched-default snapshot to a fresh start', () => {
    const terminal = THEMES.find((t) => t.name === 'Terminal');
    window.localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ ...REGISTRY_DEFAULTS, ...terminal?.vars }),
    );
    expect(loadStoredDesign(THEMES)).toBeNull();
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it('migrates a legacy snapshot matching a non-default theme', () => {
    const glow = THEMES.find((t) => t.name === 'Glow');
    window.localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ ...REGISTRY_DEFAULTS, ...glow?.vars }),
    );
    expect(loadStoredDesign(THEMES)).toEqual({ theme: 'Glow', overrides: {} });
  });

  it('migrates legacy custom edits into overrides', () => {
    window.localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({
        ...REGISTRY_DEFAULTS,
        '--color-bg': '#0000aa',
        '--btn-gradient-end': '#ff0000',
      }),
    );
    expect(loadStoredDesign(THEMES)).toEqual({
      theme: null,
      overrides: { '--color-bg': '#0000aa' },
    });
  });
});

describe('clearStoredDesign', () => {
  it('removes both current and legacy keys', () => {
    persistDesign({ theme: DEFAULT_THEME, overrides: {} }, {});
    window.localStorage.setItem(LEGACY_KEY, '{}');
    clearStoredDesign();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});
