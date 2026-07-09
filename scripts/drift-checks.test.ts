import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { TOKEN_REGISTRY } from '../src/styles/token-registry.ts';
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
  discoverLayoutClassNames,
  reachableFrom,
} from './component-checks.ts';

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

describe('[default-value-sync]', () => {
  it('passes for the real sources', () => {
    expect(
      checkDefaultValueSync(
        THEMES,
        DEFAULT_THEME,
        read('src', 'styles', '_tokens.scss'),
        read('src', 'styles', '_base.scss'),
      ),
    ).toEqual([]);
  });

  it('fires when the default theme is unknown', () => {
    expect(checkDefaultValueSync(THEMES, 'Nope', '', '').length).toBe(1);
  });

  it('fires when a registry default disagrees with the default theme', () => {
    const fake = [{ name: 'X', vars: { '--color-bg': '#bad000' } }];
    const out = checkDefaultValueSync(fake, 'X', '', '');
    expect(out.some((m) => m.includes('--color-bg'))).toBe(true);
  });

  it('fires on a drifted literal $token and skips computed values', () => {
    const scss = '$color-bg: #bad000;\n$bevel-highlight: bevel-tone($x, 1);\n';
    const def = THEMES.find((t) => t.name === DEFAULT_THEME) ?? {
      name: DEFAULT_THEME,
      vars: {},
    };
    const out = checkDefaultValueSync([def], DEFAULT_THEME, scss, '');
    expect(out.length).toBe(1);
    expect(out[0]).toContain('$color-bg');
  });

  it('fires on a drifted :root literal', () => {
    const base = ':root {\n  --anim-speed: 9s;\n}\n';
    const def = THEMES.find((t) => t.name === DEFAULT_THEME) ?? {
      name: DEFAULT_THEME,
      vars: {},
    };
    const out = checkDefaultValueSync([def], DEFAULT_THEME, '', base);
    expect(out.some((m) => m.includes('--anim-speed'))).toBe(true);
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

// mirror validate.ts: every .scss under src/styles counts as a consumer
function readAllScss(dir: string): string {
  let out = '';
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out += readAllScss(full);
    else if (entry.name.endsWith('.scss')) out += readFileSync(full, 'utf-8');
  }
  return out;
}

describe('[token-unused]', () => {
  const scssAll = readAllScss(join('src', 'styles'));

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
  ]);

  const componentFiles = ['atoms', 'molecules', 'organisms'].flatMap((tier) =>
    readdirSync(join('src', 'components', tier))
      .filter(
        (f) =>
          f.endsWith('.tsx') &&
          !f.includes('.test.') &&
          !f.endsWith('.demo.tsx'),
      )
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

  it('fires when a component lacks a colocated .demo.tsx sibling', () => {
    const button = resolve('src', 'components', 'atoms', 'Button.tsx');
    const out = checkDemoMissing([button], reachable, new Set());
    expect(out.some((m) => m.includes('.demo.tsx'))).toBe(true);
  });

  it('passes the sibling requirement when the demo file exists', () => {
    const button = resolve('src', 'components', 'atoms', 'Button.tsx');
    const demo = resolve('src', 'components', 'atoms', 'Button.demo.tsx');
    expect(checkDemoMissing([button], reachable, new Set([demo]))).toEqual([]);
  });
});

describe('[layout-classnames]', () => {
  const scss =
    '.home-layout {\n}\n.home-content__scroll {\n}\n' +
    '.home-content--mobile {\n}\n.container-fluid {\n}\n.skeu-btn {\n}';

  it('discovers block-level home classes, not __ element classes', () => {
    const names = discoverLayoutClassNames(scss);
    expect(names).toContain('home-layout');
    expect(names).toContain('home-content--mobile');
    expect(names).toContain('container-fluid');
    expect(names).not.toContain('home-content__scroll');
    expect(names).not.toContain('skeu-btn');
  });

  it('keeps the explicit cross-partial extras', () => {
    expect(discoverLayoutClassNames('')).toContain('skeu-admin-main');
  });

  it('fires on a page using a discovered layout class', () => {
    const out = checkLayoutClassNames(scss, [
      {
        path: join('src', 'pages', 'Bad.tsx'),
        content: '<div className="home-layout" />',
      },
    ]);
    expect(out.length).toBe(1);
  });

  it('skips admin preview files and the layout molecules', () => {
    const files = [
      {
        path: join('src', 'pages', 'admin', 'preview', 'Demo.tsx'),
        content: '<div className="home-layout" />',
      },
      {
        path: join('src', 'components', 'molecules', 'ScrollArea.tsx'),
        content: '<div className="home-layout" />',
      },
    ];
    expect(checkLayoutClassNames(scss, files)).toEqual([]);
  });
});

describe('[style-prop]', () => {
  it('fires on HTMLAttributes props without a style block', () => {
    const out = checkStyleProps([
      {
        path: 'src/components/atoms/Leaky.tsx',
        content: 'type P = React.HTMLAttributes<HTMLDivElement>;',
      },
    ]);
    expect(out.length).toBe(1);
  });

  it('passes DesignSystemProps and explicit style Omits', () => {
    const out = checkStyleProps([
      {
        path: 'a.tsx',
        content:
          'type P = { x?: string } & DesignSystemProps<HTMLDivElement>;' +
          ' HTMLAttributes<',
      },
      {
        path: 'b.tsx',
        content: "type P = Omit<React.HTMLAttributes<HTMLElement>, 'style'>;",
      },
      { path: 'c.tsx', content: 'no html attributes here' },
    ]);
    expect(out).toEqual([]);
  });
});

describe('[semantic-html]', () => {
  function srcTsxFiles(dir: string): { path: string; content: string }[] {
    const out: { path: string; content: string }[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...srcTsxFiles(full));
      else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
        out.push({ path: full, content: readFileSync(full, 'utf-8') });
      }
    }
    return out;
  }

  it('passes for the real src tree', () => {
    expect(checkSemanticHtml(srcTsxFiles('src'))).toEqual([]);
  });

  it('fires on raw heading and paragraph tags', () => {
    const out = checkSemanticHtml([
      { path: join('src', 'pages', 'Bad.tsx'), content: '<h1>x</h1><p>y</p>' },
    ]);
    expect(out.length).toBe(1);
    expect(out[0]).toContain('h1');
    expect(out[0]).toContain('p');
  });

  it('skips exempt files', () => {
    const out = checkSemanticHtml([
      {
        path: join('src', 'AppErrorBoundary.tsx'),
        content: '<h1>crash</h1><p>details</p>',
      },
      {
        path: join('src', 'components', 'atoms', 'Heading.tsx'),
        content: '<h2>real</h2>',
      },
    ]);
    expect(out).toEqual([]);
  });

  it('does not flag inline marks or tags in prop strings', () => {
    const out = checkSemanticHtml([
      {
        path: join('src', 'pages', 'Ok.tsx'),
        content: '<span>x</span><em>y</em><strong>z</strong>',
      },
    ]);
    expect(out).toEqual([]);
  });
});
