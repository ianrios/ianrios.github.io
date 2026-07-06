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
  checkDemoMissing,
  reachableFrom,
} from './drift-checks.ts';

// Flip `asError` to true in step 1c so the drift checks fail `npm run check`.
// Object property (not a literal const) so the type stays `boolean`.
const DRIFT = { asError: true };

const MAX_MD_FILES = 25;
const MAX_MD_LINES = 80;
const MAX_CODE_LINES = 250;
const MAX_MD_STORY_LINES = 280;

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'build',
  'coverage',
  '.firebase',
]);

const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

type ViolationType =
  | 'eslint-disable'
  | 'code-size'
  | 'doc-size'
  | 'md-count'
  | 'token-sync'
  | 'control-sync'
  | 'defaults-sync'
  | 'default-value-sync'
  | 'preset-token'
  | 'theme-control'
  | 'token-unused'
  | 'token-example'
  | 'token-specimen'
  | 'demo-missing';

const DRIFT_TYPES: ViolationType[] = [
  'token-sync',
  'control-sync',
  'defaults-sync',
  'default-value-sync',
  'preset-token',
  'theme-control',
  'token-unused',
  'token-example',
  'token-specimen',
  'demo-missing',
];

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

function isDataFile(f: string): boolean {
  return /[Dd]ata\.[jt]sx?$/.test(f) || f.includes('/data/');
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
const scssAll =
  read('src', 'styles', '_base.scss') +
  read('src', 'styles', '_components.scss') +
  read('src', 'styles', '_tokens.scss');
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
  resolve('src', 'pages', 'admin', 'V2Preview.tsx'),
]);
const componentFiles: string[] = [];
for (const tier of ['atoms', 'molecules', 'organisms']) {
  const dir = join('src', 'components', tier);
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.tsx')) componentFiles.push(resolve(dir, entry));
  }
}

const tokensScssSrc = read('src', 'styles', '_tokens.scss');
const baseScssSrc = read('src', 'styles', '_base.scss');

const driftChecks: [ViolationType, string[]][] = [
  ['token-sync', checkTokenSync(scssTokens, rootVars)],
  ['control-sync', checkControlSync(rootVars)],
  ['defaults-sync', checkDefaultsSync(Object.keys(DEFAULTS), rootVars)],
  [
    'default-value-sync',
    checkDefaultValueSync(THEMES, DEFAULT_THEME, tokensScssSrc, baseScssSrc),
  ],
  ['preset-token', checkPresetTokens(THEMES, rootVars)],
  ['theme-control', checkThemeControls(THEMES)],
  ['token-unused', checkTokenUnused(scssAll)],
  ['token-example', checkTokenExample(specimenSrc, previewSrc)],
  ['token-specimen', checkTokenSpecimen(specimenSrc)],
  ['demo-missing', checkDemoMissing(componentFiles, reachable)],
];
for (const [type, messages] of driftChecks) {
  for (const message of messages) flag(type, message);
}

// ─── Report ───────────────────────────────────────────────────────────────
const hard = violations.filter((v) => !DRIFT_TYPES.includes(v.type));
const drift = violations.filter((v) => DRIFT_TYPES.includes(v.type));
const fatal = DRIFT.asError ? violations : hard;

if (drift.length > 0 && !DRIFT.asError) {
  console.error('\n⚠️  Token drift (warnings - will become errors):\n');
  for (const v of drift) {
    console.error(`  [${v.type.padEnd(14)}] ${v.message}`);
  }
  console.error('');
}

if (fatal.length === 0) {
  console.error('✅ Validation passed');
  process.exit(0);
}

console.error('\n❌ Validation failed:\n');
for (const v of fatal) {
  console.error(`  [${v.type.padEnd(14)}] ${v.message}`);
}
console.error('');
process.exit(1);
