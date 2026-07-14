#!/usr/bin/env tsx
/// <reference types="node" />

/**
 * Resize an image (preserving aspect ratio, never upscaling) and re-encode
 * it to WebP. Reusable CLI for shrinking large source photos before they
 * ship in `public/`.
 *
 * Usage:
 *   npm run optimize-images -- <input> <output> <maxWidth> [quality]
 *
 * Example:
 *   npm run optimize-images -- public/img/Ian-1.jpg public/img/ian-1.webp 1280
 */

import { existsSync, statSync } from 'fs';
import { resolve } from 'path';
import sharp from 'sharp';

const DEFAULT_QUALITY = 82;

async function main(): Promise<void> {
  const [inputArg, outputArg, maxWidthArg, qualityArg] = process.argv.slice(2);

  if (inputArg === undefined || outputArg === undefined) {
    console.error(
      'Usage: npm run optimize-images -- <input> <output> <maxWidth> [quality]',
    );
    process.exit(1);
  }

  const maxWidth = maxWidthArg !== undefined ? Number(maxWidthArg) : NaN;
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    console.error(`maxWidth must be a positive number, got: ${maxWidthArg}`);
    process.exit(1);
  }

  const quality =
    qualityArg !== undefined ? Number(qualityArg) : DEFAULT_QUALITY;
  if (!Number.isFinite(quality) || quality <= 0 || quality > 100) {
    console.error(`quality must be between 1 and 100, got: ${qualityArg}`);
    process.exit(1);
  }

  const inputPath = resolve(inputArg);
  const outputPath = resolve(outputArg);

  if (!existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const inputBytes = statSync(inputPath).size;

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  const outputBytes = statSync(outputPath).size;
  const reduction = (100 * (1 - outputBytes / inputBytes)).toFixed(1);

  // Convention in this repo's scripts/: console.error carries all CLI
  // output (see validate.ts), since no-console only allows warn/error.
  console.error(
    `${inputArg} (${(inputBytes / 1024).toFixed(0)}KB) -> ${outputArg} ` +
      `(${(outputBytes / 1024).toFixed(0)}KB, -${reduction}%) ` +
      `[maxWidth=${maxWidth}, quality=${quality}]`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
