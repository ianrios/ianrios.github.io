import { describe, it, expect } from 'vitest';
import { TOKEN_REGISTRY, REGISTRY_DEFAULTS } from '../../styles/token-registry';
import { THEMES, DEFAULTS, detectMatchingPreset } from './adminData';

const registryVars = new Set(TOKEN_REGISTRY.map((t) => t.cssVar));

// Themes write every editable token EXCEPT: the derived bevel tones (recomputed
// from bg/surface by applyTheme), --anim-speed-fast (derived from --anim-speed
// in useDesignVars), and --clickable-border-width (a global control that
// persists across theme switches — editable but intentionally theme-
// independent). This is the set applyTheme must fully cover.
const GLOBAL_CONTROLS = new Set(['--clickable-border-width']);
const WRITABLE = new Set(
  TOKEN_REGISTRY.filter(
    (t) =>
      t.category !== 'bevel' &&
      t.cssVar !== '--anim-speed-fast' &&
      !GLOBAL_CONTROLS.has(t.cssVar),
  ).map((t) => t.cssVar),
);

describe('THEMES — complete theme presets', () => {
  it('mirrors the [preset-token] rule: every key is a real registry var', () => {
    for (const theme of THEMES) {
      for (const key of Object.keys(theme.vars)) {
        expect(registryVars, `${theme.name} writes ${key}`).toContain(key);
      }
    }
  });

  it('every theme writes every editable (non-derived) category', () => {
    for (const theme of THEMES) {
      expect(new Set(Object.keys(theme.vars)), theme.name).toEqual(WRITABLE);
    }
  });

  it('has no derived bevel tones in any theme', () => {
    for (const theme of THEMES) {
      for (const key of Object.keys(theme.vars)) {
        expect(key.startsWith('--bevel-')).toBe(false);
      }
    }
  });

  it('has unique theme names and no duplicate var sets', () => {
    const names = THEMES.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    const fingerprints = THEMES.map((t) => JSON.stringify(t.vars));
    expect(new Set(fingerprints).size).toBe(fingerprints.length);
  });

  it('default theme (Terminal) matches the registry defaults', () => {
    const terminal = THEMES.find((t) => t.name === 'Terminal');
    expect(terminal).toBeDefined();
    for (const [key, value] of Object.entries(terminal?.vars ?? {})) {
      expect(REGISTRY_DEFAULTS[key], key).toBe(value);
    }
    // A fresh load (DEFAULTS) therefore detects Terminal as the active theme.
    expect(detectMatchingPreset(THEMES, DEFAULTS)).toBe('Terminal');
  });

  it('spans the full depth range across the set (hard ↔ soft)', () => {
    const blurs = THEMES.map((t) => parseFloat(t.vars['--depth-blur'] ?? '0'));
    expect(Math.min(...blurs)).toBe(0); // a hard bevel exists
    expect(Math.max(...blurs)).toBeGreaterThanOrEqual(20); // a soft neu exists
  });
});
