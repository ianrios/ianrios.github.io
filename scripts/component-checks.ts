// Component/markup drift checks - reachability and raw-tag scanning, as
// opposed to drift-checks.ts's token-synchronization checks. Split out
// purely for scripts/*.ts's 250-line code-size budget; same pure
// check*(data) -> string[] contract, file IO stays in validate.ts.

import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

// [semantic-html] every h1-h6/block-level p should be the Heading/Text atom,
// not a raw tag, so typography always routes through the token-driven
// components rather than hand-styled markup. Inline marks (span/em/strong/a)
// are not checked - they're typically nested inside an already-wrapped
// Heading/Text, and Text's own `as` union covers em/strong for that case.
const SEMANTIC_HTML_EXEMPT = new Set([
  join('src', 'components', 'atoms', 'Heading.tsx'),
  join('src', 'components', 'atoms', 'Text.tsx'),
  // An error-boundary fallback must render even if the design system itself
  // is what crashed, so it stays dependency-free raw HTML on purpose.
  join('src', 'AppErrorBoundary.tsx'),
]);
export function checkSemanticHtml(
  files: { path: string; content: string }[],
): string[] {
  const out: string[] = [];
  for (const { path, content } of files) {
    if (SEMANTIC_HTML_EXEMPT.has(path)) continue;
    const matches = content.match(/<(h[1-6]|p)[ >]/g);
    if (matches) {
      const tags = [...new Set(matches.map((m) => m.slice(1, -1)))];
      out.push(`${path} has raw <${tags.join('>, <')}> - use Heading/Text`);
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
