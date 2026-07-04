import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { TOKEN_REGISTRY } from '../src/styles/token-registry.ts';
import { DEFAULTS, THEMES } from '../src/pages/admin/adminData.ts';
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

const read = (...p: string[]) => readFileSync(join(...p), 'utf-8');
const rootVars = parseRootVars(read('src', 'styles', '_base.scss'));
const registryVars = new Set(TOKEN_REGISTRY.map((t) => t.cssVar));

describe('registry → DEFAULTS derivation', () => {
  it('DEFAULTS keys exactly match the :root var set', () => {
    expect(new Set(Object.keys(DEFAULTS))).toEqual(rootVars);
  });

  it('every registry token has a default value', () => {
    for (const t of TOKEN_REGISTRY) {
      expect(t.default.length).toBeGreaterThan(0);
    }
  });
});

describe('[token-sync]', () => {
  it('passes for the real SCSS sources', () => {
    const tokens = parseScssTokens(read('src', 'styles', '_tokens.scss'));
    expect(checkTokenSync(tokens, rootVars)).toEqual([]);
  });

  it('fires when a $token has no :root var', () => {
    const out = checkTokenSync(new Set(['ghost-token']), new Set());
    expect(out.length).toBeGreaterThan(0);
  });
});

describe('[control-sync]', () => {
  it('passes when :root and the registry agree', () => {
    expect(checkControlSync(rootVars)).toEqual([]);
  });

  it('fires on a :root var missing from the registry', () => {
    const out = checkControlSync(new Set([...registryVars, '--ghost']));
    expect(out.some((m) => m.includes('--ghost'))).toBe(true);
  });

  it('fires on a registry token missing from :root', () => {
    const dropped = new Set(registryVars);
    dropped.delete('--color-bg');
    const out = checkControlSync(dropped);
    expect(out.some((m) => m.includes('--color-bg'))).toBe(true);
  });
});

describe('[defaults-sync]', () => {
  it('passes for the real DEFAULTS', () => {
    expect(checkDefaultsSync(Object.keys(DEFAULTS), rootVars)).toEqual([]);
  });

  it('fires when DEFAULTS is missing a :root var', () => {
    const out = checkDefaultsSync(
      ['--color-bg'],
      new Set(['--color-bg', '--x']),
    );
    expect(out.some((m) => m.includes('--x'))).toBe(true);
  });
});

describe('[preset-token]', () => {
  it('passes when a preset writes only real vars', () => {
    const out = checkPresetTokens(
      [{ name: 'ok', vars: { '--color-bg': '#000' } }],
      rootVars,
    );
    expect(out).toEqual([]);
  });

  it('fires when a preset writes an unknown var', () => {
    const out = checkPresetTokens(
      [{ name: 'bad', vars: { '--not-real': '#000' } }],
      rootVars,
    );
    expect(out.length).toBeGreaterThan(0);
  });
});

describe('[theme-control]', () => {
  it('every token the real THEMES write has a sidebar control (parity)', () => {
    expect(checkThemeControls(THEMES)).toEqual([]);
  });

  it('fires when a theme writes a token with no control', () => {
    // --anim-speed-fast is derived (no control); a theme must never set it.
    const out = checkThemeControls([
      { name: 'bad', vars: { '--anim-speed-fast': '0.01s' } },
    ]);
    expect(out.length).toBeGreaterThan(0);
  });
});

describe('[token-unused]', () => {
  const scssAll =
    read('src', 'styles', '_base.scss') +
    read('src', 'styles', '_components.scss') +
    read('src', 'styles', '_tokens.scss');

  it('passes for the real SCSS (every controlled token is consumed)', () => {
    expect(checkTokenUnused(scssAll)).toEqual([]);
  });

  it('fires when a controlled token has no var() consumer', () => {
    // A controlled token (--color-bg) absent from the source must be flagged.
    const out = checkTokenUnused('.x { color: red; }');
    expect(out.some((m) => m.includes('--color-bg'))).toBe(true);
  });

  it('allow-lists --depth-contrast (editable but JS-only)', () => {
    const out = checkTokenUnused('.x { color: red; }');
    expect(out.some((m) => m.includes('--depth-contrast'))).toBe(false);
  });
});

describe('[token-example]', () => {
  const tokensSectionSrc = read(
    'src',
    'pages',
    'admin',
    'preview',
    'TokensSection.tsx',
  );
  const previewDir = ['src', 'pages', 'admin', 'preview'];
  let previewSrc = read('src', 'pages', 'admin', 'DSPreview.tsx');
  for (const f of readdirSync(join(...previewDir))) {
    if (f.endsWith('.tsx')) previewSrc += read(...previewDir, f);
  }

  it('every editable token is covered in the real preview', () => {
    expect(checkTokenExample(tokensSectionSrc, previewSrc)).toEqual([]);
  });

  it('fires when a swatch-category token has no specimen or ref', () => {
    // No categoryVars() and empty preview → color tokens (specimen category,
    // not component-demonstrated) must be flagged.
    const out = checkTokenExample('', '');
    expect(out.some((m) => m.includes('--color-bg'))).toBe(true);
  });

  it('treats button/depth/focus as component-demonstrated (not flagged)', () => {
    const out = checkTokenExample('', '');
    expect(out.some((m) => m.includes('--btn-radius'))).toBe(false);
    expect(out.some((m) => m.includes('--depth-blur'))).toBe(false);
  });
});

describe('[token-specimen]', () => {
  const good =
    "categoryVars('color') categoryVars('link') categoryVars('font') " +
    "categoryVars('spacing') categoryVars('radii') categoryVars('motion') " +
    "categoryVars('bevel')";

  it('passes when every displayed category is rendered', () => {
    expect(checkTokenSpecimen(good)).toEqual([]);
  });

  it('passes for the real TokensSection source', () => {
    const src = read('src', 'pages', 'admin', 'preview', 'TokensSection.tsx');
    expect(checkTokenSpecimen(src)).toEqual([]);
  });

  it('fires when a displayed category has no specimen', () => {
    const missingBevel = good.replace("categoryVars('bevel')", '');
    const out = checkTokenSpecimen(missingBevel);
    expect(out.some((m) => m.includes('bevel'))).toBe(true);
  });
});

describe('[demo-missing]', () => {
  const reachable = reachableFrom([
    resolve('src', 'pages', 'admin', 'DSPreview.tsx'),
    resolve('src', 'pages', 'admin', 'V2Preview.tsx'),
  ]);

  const componentFiles = ['atoms', 'molecules', 'organisms'].flatMap((tier) =>
    readdirSync(join('src', 'components', tier))
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => resolve('src', 'components', tier, f)),
  );

  it('every component is reachable from the preview tree', () => {
    expect(checkDemoMissing(componentFiles, reachable)).toEqual([]);
  });

  it('the traversal actually resolved component imports', () => {
    const button = resolve('src', 'components', 'atoms', 'Button.tsx');
    expect(reachable.has(button)).toBe(true);
  });

  it('fires for an un-demoed component', () => {
    const out = checkDemoMissing(
      ['/src/components/atoms/Ghost.tsx'],
      reachable,
    );
    expect(out.length).toBe(1);
  });
});
