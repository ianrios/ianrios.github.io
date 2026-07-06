// [default-value-sync] first paint == registry defaults == the default theme.
// Three-way value comparison (the drift-checks.ts checks only compare key
// sets):
//   1. registry `default` values equal THEMES[DEFAULT_THEME] for every token
//      the theme writes;
//   2. literal `$token:` values in _tokens.scss equal the registry defaults
//      (computed values — anything containing `$` or `#{` — are skipped);
//   3. literal :root declarations in _base.scss (non-interpolated, e.g.
//      --anim-speed) equal the registry defaults.
// Changing the default theme = edit DEFAULT_THEME; this check lists every
// literal that must follow.
import { TOKEN_REGISTRY } from '../src/styles/token-registry.ts';
import type { PresetLike } from './drift-checks.ts';

const normalizeValue = (v: string): string => v.replace(/\s+/g, '');

export function checkDefaultValueSync(
  themes: PresetLike[],
  defaultThemeName: string,
  tokensScss: string,
  baseScss: string,
): string[] {
  const out: string[] = [];
  const def = themes.find((t) => t.name === defaultThemeName);
  if (!def) return [`default theme "${defaultThemeName}" is not in THEMES`];
  for (const t of TOKEN_REGISTRY) {
    const themeVal = def.vars[t.cssVar];
    if (
      themeVal !== undefined &&
      normalizeValue(themeVal) !== normalizeValue(t.default)
    ) {
      out.push(
        `${t.cssVar}: registry default "${t.default}" != ` +
          `${defaultThemeName} "${themeVal}"`,
      );
    }
  }
  const byVar = new Map(TOKEN_REGISTRY.map((t) => [t.cssVar, t.default]));
  for (const m of tokensScss.matchAll(/^\$([\w-]+)\s*:\s*([^;]+);/gm)) {
    const name = m[1];
    const value = (m[2] ?? '').replace(/!default\s*$/, '').trim();
    if (value.includes('$') || value.includes('#{')) continue;
    const reg = name === undefined ? undefined : byVar.get(`--${name}`);
    if (reg !== undefined && normalizeValue(value) !== normalizeValue(reg)) {
      out.push(`$${name}: "${value}" != registry default "${reg}"`);
    }
  }
  const start = baseScss.indexOf(':root {');
  const end = baseScss.indexOf('\n}', start);
  const block = start >= 0 && end >= 0 ? baseScss.slice(start, end) : '';
  for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const cssVar = m[1];
    const value = (m[2] ?? '').trim();
    if (value.includes('#{')) continue;
    const reg = cssVar === undefined ? undefined : byVar.get(cssVar);
    if (reg !== undefined && normalizeValue(value) !== normalizeValue(reg)) {
      out.push(`:root ${cssVar}: "${value}" != registry default "${reg}"`);
    }
  }
  return out;
}
