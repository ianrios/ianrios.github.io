// Persistence for the live design system. Stored shape (design:v1) is
// semantic: the theme the user started from + only the tokens they edited.
// `snapshot` is the fully resolved var map, regenerated on every persist —
// it exists solely so the index.html flash script can replay it before any
// module loads, and so stale keys can never outlive one persist cycle.
import { TOKEN_REGISTRY, REGISTRY_DEFAULTS } from '../../styles/token-registry';
import type { CSSTokenMap, Preset, StoredDesign } from '../../types/admin';

export const STORAGE_KEY = 'design:v1';
const LEGACY_KEY = 'skeuomorph:vars';

const EDITABLE_VARS = new Set(
  TOKEN_REGISTRY.filter((t) => t.control).map((t) => t.cssVar),
);

function isTokenMap(v: unknown): v is CSSTokenMap {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  return Object.values(v).every((x) => typeof x === 'string');
}

export function isStoredDesign(v: unknown): v is StoredDesign {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    o.version === 1 &&
    (o.theme === null || typeof o.theme === 'string') &&
    isTokenMap(o.overrides) &&
    isTokenMap(o.snapshot)
  );
}

/** Keep only registry-editable vars with non-empty values. */
export function filterEditable(m: CSSTokenMap): CSSTokenMap {
  return Object.fromEntries(
    Object.entries(m)
      .filter(([k, v]) => EDITABLE_VARS.has(k) && v.trim() !== '')
      .map(([k, v]) => [k, v.trim()]),
  );
}

export function detectMatchingPreset(
  presets: Preset[],
  currentVars: CSSTokenMap,
): string | null {
  for (const p of presets) {
    if (Object.entries(p.vars).every(([k, v]) => currentVars[k] === v))
      return p.name;
  }
  return null;
}

export interface DesignState {
  theme: string | null;
  overrides: CSSTokenMap;
}

// The legacy full-snapshot format was persisted involuntarily on first visit,
// so "matches the old default theme (Terminal)" means "never customized" —
// those users start fresh on the new default. Real edits become overrides.
function migrateLegacy(
  themes: Preset[],
  legacy: CSSTokenMap,
): DesignState | null {
  const editable = filterEditable(legacy);
  const matched = detectMatchingPreset(themes, editable);
  if (matched === 'Terminal') return null;
  if (matched) return { theme: matched, overrides: {} };
  const overrides = Object.fromEntries(
    Object.entries(editable).filter(([k, v]) => REGISTRY_DEFAULTS[k] !== v),
  );
  return Object.keys(overrides).length > 0 ? { theme: null, overrides } : null;
}

/** Stored design state, or null when the visitor has never customized. */
export function loadStoredDesign(themes: Preset[]): DesignState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (!isStoredDesign(parsed)) return null;
      // A theme that no longer exists invalidates its overrides too (they
      // were diffs against that theme's base).
      if (parsed.theme !== null && !themes.some((t) => t.name === parsed.theme))
        return null;
      return {
        theme: parsed.theme,
        overrides: filterEditable(parsed.overrides),
      };
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);
    if (!legacyRaw) return null;
    window.localStorage.removeItem(LEGACY_KEY);
    const legacy: unknown = JSON.parse(legacyRaw);
    return isTokenMap(legacy) ? migrateLegacy(themes, legacy) : null;
  } catch {
    return null;
  }
}

export function persistDesign(state: DesignState, snapshot: CSSTokenMap): void {
  const stored: StoredDesign = { version: 1, ...state, snapshot };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage unavailable (private mode, quota) — session-only styling
  }
}

export function clearStoredDesign(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}
