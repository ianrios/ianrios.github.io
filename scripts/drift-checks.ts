// Pure design-token drift checks, shared by scripts/validate.ts and the unit
// tests. Each `check*` takes already-parsed data and returns human-readable
// violation messages (empty array == in sync). File IO lives in validate.ts;
// the import-graph helpers here are pure given the filesystem.

import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';
import {
  TOKEN_REGISTRY,
  SPECIMEN_CATEGORIES,
  SPECIMEN_ALLOWLIST,
} from '../src/styles/token-registry.ts';

export interface PresetLike {
  name: string;
  vars: Record<string, string>;
}

const registryVars = new Set(TOKEN_REGISTRY.map((t) => t.cssVar));
const controlledVars = new Set(
  TOKEN_REGISTRY.filter((t) => t.control).map((t) => t.cssVar),
);

// [theme-control] every token a THEME writes must have an editable sidebar
// control, so switching themes is always fully reflected in the controls panel
// (full parity). Catches "theme changes a token with no UI knob".
export function checkThemeControls(themes: PresetLike[]): string[] {
  const out: string[] = [];
  for (const theme of themes) {
    for (const key of Object.keys(theme.vars)) {
      if (!controlledVars.has(key)) {
        out.push(`theme "${theme.name}" writes ${key} which has no control`);
      }
    }
  }
  return out;
}

// [token-unused] every editable (controlled) token must have a real var()
// consumer in SCSS — a control that changes a token nothing reads is a no-op.
// Inverse of [theme-control]: together they guarantee every editable token both
// has a control AND does something. --depth-contrast is the one exception:
// editable but JS-only (drives computeBevelTones in useDesignVars, no var()).
const TOKEN_UNUSED_ALLOW = new Set(['--depth-contrast']);
export function checkTokenUnused(scss: string): string[] {
  const out: string[] = [];
  for (const v of controlledVars) {
    if (TOKEN_UNUSED_ALLOW.has(v)) continue;
    if (
      !scss.includes(`var(${v})`) &&
      !scss.includes(`var(${v},`) &&
      !scss.includes(`var(${v} `)
    ) {
      out.push(`controlled token ${v} has no var() consumer in SCSS (dead)`);
    }
  }
  return out;
}

// [token-example] every editable token must have a LIVE example in the preview,
// so a control always shows a visible effect on the design-system page. A token
// is covered three ways (honest coverage, not proven pixel-change — that stays
// Ian's manual review): (1) its category is rendered as a swatch specimen in
// TokensSection via categoryVars(); (2) its category is demonstrated live by a
// component demo rather than a swatch (button shape/fill, depth bevel reacting,
// focus ring on Input); or (3) its cssVar is literally referenced by a bespoke
// preview specimen (e.g. TokenShowcase's var(--drawer-width)).
const COMPONENT_DEMO_CATEGORIES = new Set(['button', 'depth', 'focus']);
export function checkTokenExample(
  tokensSectionSrc: string,
  previewSrc: string,
): string[] {
  const specimenCats = new Set<string>();
  const re = /categoryVars\(\s*['"]([\w-]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tokensSectionSrc)) !== null) {
    const cat = m[1];
    if (cat) specimenCats.add(cat);
  }
  const out: string[] = [];
  for (const t of TOKEN_REGISTRY) {
    if (!t.control) continue;
    if (specimenCats.has(t.category)) continue;
    if (COMPONENT_DEMO_CATEGORIES.has(t.category)) continue;
    if (previewSrc.includes(t.cssVar)) continue;
    out.push(`editable token ${t.cssVar} has no live example in the preview`);
  }
  return out;
}

/** Custom-property declarations inside the `:root {}` block of _base.scss. */
export function parseRootVars(baseScss: string): Set<string> {
  const start = baseScss.indexOf(':root {');
  const end = baseScss.indexOf('\n}', start);
  const block = start >= 0 && end >= 0 ? baseScss.slice(start, end) : '';
  const vars = new Set<string>();
  for (const m of block.matchAll(/(--[\w-]+)\s*:/g)) {
    if (m[1]) vars.add(m[1]);
  }
  return vars;
}

/** Top-level `$token:` declarations in _tokens.scss. */
export function parseScssTokens(tokensScss: string): Set<string> {
  const tokens = new Set<string>();
  for (const m of tokensScss.matchAll(/^\$([\w-]+)\s*:/gm)) {
    if (m[1]) tokens.add(m[1]);
  }
  return tokens;
}

// [token-sync] every $token is exposed as a :root --var.
export function checkTokenSync(
  scssTokens: Set<string>,
  rootVars: Set<string>,
): string[] {
  const out: string[] = [];
  for (const tok of scssTokens) {
    if (!rootVars.has(`--${tok}`)) {
      out.push(`$${tok} has no :root --${tok} in _base.scss`);
    }
  }
  return out;
}

// [control-sync] :root vars and registry entries are the same set.
export function checkControlSync(rootVars: Set<string>): string[] {
  const out: string[] = [];
  for (const v of rootVars) {
    if (!registryVars.has(v)) {
      out.push(`:root ${v} is missing from the token registry`);
    }
  }
  for (const v of registryVars) {
    if (!rootVars.has(v)) out.push(`registry token ${v} is not a :root var`);
  }
  return out;
}

// [defaults-sync] DEFAULTS key set == :root var set.
export function checkDefaultsSync(
  defaultsKeys: Iterable<string>,
  rootVars: Set<string>,
): string[] {
  const out: string[] = [];
  const keys = new Set(defaultsKeys);
  for (const v of rootVars) {
    if (!keys.has(v)) out.push(`DEFAULTS is missing ${v}`);
  }
  for (const v of keys) {
    if (!rootVars.has(v)) out.push(`DEFAULTS has stray ${v}`);
  }
  return out;
}

// [preset-token] every --key written by a preset is a real :root var.
export function checkPresetTokens(
  presets: PresetLike[],
  rootVars: Set<string>,
): string[] {
  const out: string[] = [];
  for (const preset of presets) {
    for (const key of Object.keys(preset.vars)) {
      if (!rootVars.has(key)) {
        out.push(`preset "${preset.name}" writes unknown ${key}`);
      }
    }
  }
  return out;
}

// [token-specimen] every displayed-category token is rendered in TokensSection.
export function checkTokenSpecimen(specimenSrc: string): string[] {
  const out: string[] = [];
  const shown = new Set(SPECIMEN_CATEGORIES);
  for (const cat of SPECIMEN_CATEGORIES) {
    const hasToken = TOKEN_REGISTRY.some((t) => t.category === cat);
    if (hasToken && !specimenSrc.includes(`categoryVars('${cat}')`)) {
      shown.delete(cat);
    }
  }
  for (const t of TOKEN_REGISTRY) {
    if (!SPECIMEN_CATEGORIES.includes(t.category)) continue;
    if (SPECIMEN_ALLOWLIST.includes(t.cssVar)) continue;
    if (!shown.has(t.category)) {
      out.push(`${t.cssVar} (${t.category}) has no specimen in TokensSection`);
    }
  }
  return out;
}

// [demo-missing] every component file must be reachable from the preview tree.
export function checkDemoMissing(
  componentFiles: string[],
  reachable: Set<string>,
): string[] {
  const out: string[] = [];
  for (const file of componentFiles) {
    if (!reachable.has(file)) {
      out.push(`${file} has no demo in the admin preview tree`);
    }
  }
  return out;
}

/** Resolve a relative import specifier to an existing source file. */
function resolveImport(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const target = resolve(dirname(fromFile), spec);
  const candidates = [
    target,
    `${target}.tsx`,
    `${target}.ts`,
    join(target, 'index.tsx'),
    join(target, 'index.ts'),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

/** Files reachable by following relative imports from the given roots. */
export function reachableFrom(roots: string[]): Set<string> {
  const seen = new Set<string>();
  const queue = [...roots];
  while (queue.length > 0) {
    const file = queue.pop();
    if (file === undefined || seen.has(file)) continue;
    seen.add(file);
    let src = '';
    try {
      src = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    for (const m of src.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)) {
      const spec = m[1];
      if (!spec) continue;
      const resolved = resolveImport(file, spec);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }
  return seen;
}
