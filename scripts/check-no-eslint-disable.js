#!/usr/bin/env node

/**
 * Check that no eslint-disable comments exist in the codebase.
 * Exit with code 1 if any are found.
 */

import fs from 'fs';
import path from 'path';

const ignorePatterns = ['node_modules', '.git', 'build'];

function isIgnored(filePath) {
  // Exclude this script itself from the check
  if (filePath.includes('check-no-eslint-disable.js')) {
    return true;
  }
  return ignorePatterns.some((pattern) => filePath.includes(pattern));
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!isIgnored(filePath)) {
        walkDir(filePath, callback);
      }
    } else if (
      filePath.endsWith('.ts') ||
      filePath.endsWith('.tsx') ||
      filePath.endsWith('.js') ||
      filePath.endsWith('.jsx')
    ) {
      if (!isIgnored(filePath)) {
        callback(filePath);
      }
    }
  });
}

let foundIssues = false;

walkDir('.', (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Match eslint-disable only in comments (// or /* ... */)
    if (/\/\/.*(eslint-disable)|(\/\*.*eslint-disable.*\*\/)/.test(line)) {
      console.error(
        `${file}:${index + 1} - eslint-disable comment not allowed: ${line.trim()}`,
      );
      foundIssues = true;
    }
  });
});

if (foundIssues) {
  console.error(
    '\n❌ eslint-disable comments are not allowed. Fix the underlying issues instead.',
  );
  process.exit(1);
}

console.log('✅ No eslint-disable comments found');
process.exit(0);
