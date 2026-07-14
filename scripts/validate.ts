#!/usr/bin/env tsx
/// <reference types="node" />

import { existsSync, readdirSync, readFileSync } from 'fs';
import { extname, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
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

const MAX_MD_FILES = 25;
const MAX_MD_LINES = 80;
const MAX_CODE_LINES = 250;
// TODO: the way we are checking scss files seems hacky, like
// as if we arent actually using the existing architecture
// we also should be checking for "style" and "classname"
// usage on anything outside of the design library
// as well as usage of magic values instead of design tokens
const MAX_SCSS_LINES = 600;
const MAX_MD_STORY_LINES = 280;

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
// two can never drift apart. Only the four structural lint names are
// declared by hand.
type ViolationType =
  | 'eslint-disable'
  | 'code-size'
  | 'doc-size'
  | 'md-count'
  | keyof typeof driftChecks;

interface Violation {
  type: ViolationType;
  message: string;
}

if (!existsSync('package.json')) {
  console.error('validate.ts must be run from the repo root');
  process.exit(1);
}

const selfPath = relative(process.cwd(), fileURLToPath(import.meta.url));

function countLines(content: string): number {
  return content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
}

// Only the real data manifests are exempt from [code-size] — naming a file
// *Data.ts does not buy an exemption.
const DATA_FILES = new Set([
  join('src', 'data.ts'),
  join('src', 'pages', 'admin', 'adminData.ts'),
]);
function isDataFile(f: string): boolean {
  return DATA_FILES.has(f);
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
const mdFiles = allFiles.filter((f) => f.endsWith('.md'));
const completedPrefix = join('.ai', 'completed') + sep;
const activeMdFiles = mdFiles.filter((f) => !f.startsWith(completedPrefix));
const codeFiles = allFiles.filter(
  (f) =>
    CODE_EXTS.has(extname(f)) &&
    !f.includes('.test.') &&
    !f.includes('.spec.') &&
    f !== selfPath,
);

// [md-count] - .ai/completed/ excluded from budget
if (activeMdFiles.length > MAX_MD_FILES) {
  flag(
    'md-count',
    `Too many .md files: ${activeMdFiles.length} (max ${MAX_MD_FILES})`,
  );
}

// [doc-size]
const storyPrefixes = [
  join('.ai', 'plans') + sep,
  join('.ai', 'specs') + sep,
  join('.ai', 'completed') + sep,
];

for (const file of mdFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = countLines(content);
  const max = storyPrefixes.some((p) => file.startsWith(p))
    ? MAX_MD_STORY_LINES
    : MAX_MD_LINES;
  if (lines > max) {
    flag('doc-size', `${file}: ${lines} lines (max ${max})`);
  }
}

// [code-size]
for (const file of codeFiles) {
  if (isDataFile(file)) continue;
  const content = readFileSync(file, 'utf-8');
  const lines = countLines(content);
  if (lines > MAX_CODE_LINES) {
    flag('code-size', `${file}: ${lines} lines (max ${MAX_CODE_LINES})`);
  }
}

const scssFiles = allFiles.filter((f) => extname(f) === '.scss');
for (const file of scssFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = countLines(content);
  if (lines > MAX_SCSS_LINES) {
    flag('code-size', `${file}: ${lines} lines (max ${MAX_SCSS_LINES})`);
  }
}

// [eslint-disable]
const disableRe = /\/\/.*(eslint-disable)|(\/\*.*eslint-disable.*\*\/)/;

for (const file of codeFiles) {
  readFileSync(file, 'utf-8')
    .split('\n')
    .forEach((line, i) => {
      if (disableRe.test(line)) {
        flag(
          'eslint-disable',
          `${file}:${i + 1} - not allowed: ${line.trim()}`,
        );
      }
    });
}

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
