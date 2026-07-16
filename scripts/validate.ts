#!/usr/bin/env tsx
/// <reference types="node" />

import { existsSync, readdirSync, readFileSync } from 'fs';
import { extname, join, resolve, sep } from 'path';
import {
  DEFAULTS,
  THEMES,
  DEFAULT_THEME,
} from '../src/pages/admin/adminData.ts';
import { checkDefaultValueSync } from './value-sync-check.ts';
import {
  parseRootVars,
  parseScssTokens,
  checkTokenSync,
  checkControlSync,
  checkDefaultsSync,
  checkPresetTokens,
  checkThemeControls,
  checkTokenUnused,
  checkTokenExample,
  checkTokenSpecimen,
} from './drift-checks.ts';
import {
  checkDemoMissing,
  checkLayoutClassNames,
  checkSemanticHtml,
  checkStyleProps,
  reachableFrom,
} from './component-checks.ts';

// Structural budgets (md-count, doc-size, code-size, and the disable-pragma
// ban) moved to @ianrios/brickwall — see brickwall.config.json. This script
// owns only the design-token drift checks.

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'build',
  'coverage',
  '.firebase',
]);

const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Drift-check names derive from the driftChecks registry object below
// (2.6 #5): registering a check IS declaring its violation type, so the
// two can never drift apart.
type ViolationType = keyof typeof driftChecks;

interface Violation {
  type: ViolationType;
  message: string;
}

if (!existsSync('package.json')) {
  console.error('validate.ts must be run from the repo root');
  process.exit(1);
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else files.push(full);
  }
  return files;
}

const violations: Violation[] = [];

function flag(type: ViolationType, message: string): void {
  violations.push({ type, message });
}

const allFiles = walkDir('.');
const codeFiles = allFiles.filter(
  (f) =>
    CODE_EXTS.has(extname(f)) &&
    !f.includes('.test.') &&
    !f.includes('.spec.'),
);

// ─── Design-token drift checks ────────────────────────────────────────────
// One canonical registry (src/styles/token-registry.ts) drives DEFAULTS, the
// admin controls, and the specimen view. These checks lint the few couplings
// that remain: SCSS ↔ :root ↔ registry ↔ presets ↔ specimen ↔ component demos.
// The logic lives in ./drift-checks.ts so the unit tests can exercise it.

const read = (...parts: string[]): string =>
  readFileSync(join(...parts), 'utf-8');

const rootVars = parseRootVars(read('src', 'styles', '_base.scss'));
const scssTokens = parseScssTokens(read('src', 'styles', '_tokens.scss'));
// All SCSS sources concatenated — [token-unused] greps these for var() use.
// Recursive so it still sees every consumer after the component-tier split.
const scssAll = walkDir(join('src', 'styles'))
  .filter((f) => f.endsWith('.scss'))
  .map((f) => readFileSync(f, 'utf-8'))
  .join('\n');
const specimenSrc = read(
  'src',
  'pages',
  'admin',
  'preview',
  'TokensSection.tsx',
);
// All preview source concatenated — [token-example] greps it for literal token
// refs (bespoke specimens like TokenShowcase's var(--drawer-width)).
const previewDir = join('src', 'pages', 'admin', 'preview');
let previewSrc = read('src', 'pages', 'admin', 'DSPreview.tsx');
for (const entry of readdirSync(previewDir)) {
  if (entry.endsWith('.tsx')) previewSrc += read(previewDir, entry);
}

// Components reachable from the admin preview import tree.
const reachable = reachableFrom([
  resolve('src', 'pages', 'admin', 'DSPreview.tsx'),
]);
// The components root is scanned too, so a stray component outside the
// atomic tiers cannot dodge the demo requirement. Colocated *.demo.tsx
// files are collected separately: they are demos, not components.
const componentFiles: string[] = [];
const demoFiles = new Set<string>();
for (const tier of ['', 'atoms', 'molecules', 'organisms']) {
  const dir = join('src', 'components', tier);
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.tsx')) continue;
    if (entry.name.includes('.test.')) continue;
    if (entry.name.endsWith('.demo.tsx')) {
      demoFiles.add(resolve(dir, entry.name));
    } else {
      componentFiles.push(resolve(dir, entry.name));
    }
  }
}

const tokensScssSrc = read('src', 'styles', '_tokens.scss');
const baseScssSrc = read('src', 'styles', '_base.scss');

// [semantic-html] scans every src/ .tsx file (not just components/pages) so
// a stray raw tag anywhere - including e.g. hooks that render - can't dodge it.
const srcTsxFiles = codeFiles
  .filter((f) => extname(f) === '.tsx' && f.startsWith(`src${sep}`))
  .map((f) => ({ path: f, content: readFileSync(f, 'utf-8') }));

// Component sources for the markup-level checks ([style-prop]).
const componentSources = [...componentFiles, ...demoFiles].map((f) => ({
  path: f,
  content: readFileSync(f, 'utf-8'),
}));

// The check registry: keys double as ViolationType members (2.6 #5), so
// adding a check here is the whole registration.
const driftChecks = {
  'token-sync': checkTokenSync(scssTokens, rootVars),
  'control-sync': checkControlSync(rootVars),
  'defaults-sync': checkDefaultsSync(Object.keys(DEFAULTS), rootVars),
  'default-value-sync': checkDefaultValueSync(
    THEMES,
    DEFAULT_THEME,
    tokensScssSrc,
    baseScssSrc,
  ),
  'preset-token': checkPresetTokens(THEMES, rootVars),
  'theme-control': checkThemeControls(THEMES),
  'token-unused': checkTokenUnused(scssAll),
  'token-example': checkTokenExample(specimenSrc, previewSrc),
  'token-specimen': checkTokenSpecimen(specimenSrc),
  'demo-missing': checkDemoMissing(componentFiles, reachable, demoFiles),
  'semantic-html': checkSemanticHtml(srcTsxFiles),
  'layout-classnames': checkLayoutClassNames(scssAll, srcTsxFiles),
  'style-prop': checkStyleProps(componentSources),
};
for (const [type, messages] of Object.entries(driftChecks)) {
  for (const message of messages) flag(type as ViolationType, message);
}

// ─── Report ───────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.error('✅ Validation passed');
  process.exit(0);
}

console.error('\n❌ Validation failed:\n');
for (const v of violations) {
  console.error(`  [${v.type.padEnd(14)}] ${v.message}`);
}
console.error('');
process.exit(1);
