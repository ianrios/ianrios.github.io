#!/usr/bin/env node

const MAX_MD_FILES = 25;
const MAX_MD_LINES = 80;
const MAX_CODE_LINES = 250;
const MAX_MD_STORY_LINES = 280;

/**
 * Validates all files in the repo:
 * 1. Markdown file line limits:
 *    - .ai/plans, .ai/specs, .ai/completed: max {MAX_MD_STORY_LINES} lines
 *    - All other markdown files: max {MAX_MD_LINES} lines
 * 2. Code file line limits (non-test files): max {MAX_CODE_LINES} lines
 * 3. Markdown file count: max {MAX_MD_FILES} .md files total
 */

import fs from 'fs';
import path from 'path';

const excludeDirs = new Set(['node_modules', '.git', 'build']);

function walkDir(dir, fileExtension) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (excludeDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, fileExtension));
    } else if (entry.name.endsWith(fileExtension)) {
      files.push(fullPath);
    }
  }
  return files;
}

const errors = [];

// Find all markdown files in repo
const mdFiles = walkDir('.', '.md');

// Check markdown file count
if (mdFiles.length > MAX_MD_FILES) {
  errors.push(
    `Too many .md files: ${mdFiles.length} files (max ${MAX_MD_FILES}). Use progressive disclosure and consolidate duplicates.`,
  );
}

// Check markdown line limits
for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const lineCount = content.split('\n').length;

  const maxLines =
    file.includes('.ai/plans/') ||
    file.includes('.ai/specs/') ||
    file.includes('.ai/completed/')
      ? MAX_MD_STORY_LINES
      : MAX_MD_LINES;

  if (lineCount > maxLines) {
    errors.push(`${file}: ${lineCount} lines (max ${maxLines})`);
  }
}

// Find all code files (non-test)
const codeExtensions = ['.ts', '.tsx', '.js', '.jsx'];
const codeFiles = codeExtensions
  .flatMap((ext) => walkDir('.', ext))
  .filter((file) => !file.includes('.test.') && !file.includes('.spec.'));

// Check code file line limits (data files are exempt)
for (const file of codeFiles) {
  if (/[Dd]ata\.[jt]sx?$/.test(file) || file.includes('/data/')) continue;
  const content = fs.readFileSync(file, 'utf-8');
  const lineCount = content.split('\n').length;

  if (lineCount > MAX_CODE_LINES) {
    errors.push(`${file}: ${lineCount} lines (max ${MAX_CODE_LINES})`);
  }
}

if (errors.length > 0) {
  console.error('❌ Documentation validation failed:\n');
  errors.forEach((err) => console.error(`  • ${err}`));
  process.exit(1);
}

console.log('✅ Documentation structure valid');
process.exit(0);
