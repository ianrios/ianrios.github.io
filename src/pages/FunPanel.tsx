import { useState } from 'react';
import { useDesignVars } from '../hooks/designVarsContext';
import { THEMES, DEFAULT_THEME } from './admin/adminData';
import { PresetSelect } from './admin/TokenPresets';
import {
  blendColor,
  blendNumeric,
  isColorValue,
} from './admin/themeInterpolate';
import { Slider } from '../components/atoms/Slider';
import { Select } from '../components/atoms/Select';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { Stack } from '../components/atoms/Stack';

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const THEME_OPTIONS = THEMES.map((p) => ({ value: p.name, label: p.name }));
const FONT_BASE: [string, number][] = [
  ['--font-xxs', 12],
  ['--font-xs', 14],
  ['--font-sm', 16],
  ['--font-base', 18],
  ['--font-lg', 22],
  ['--font-xl', 28],
];

// The playful, non-designer panel (portfolio/about): a handful of big dials
// that each drive several tokens at once for dramatic, whole-look changes.
// The full per-token controls live on /design-system.
export function FunPanel() {
  const { vars, setVar, activeTheme, applyTheme } = useDesignVars();
  const [depth, setDepth] = useState(50);
  const [round, setRound] = useState(50);
  const [tempo, setTempo] = useState(50);
  const [scale, setScale] = useState(50);
  const [blendFrom, setBlendFrom] = useState(THEMES[0]?.name ?? DEFAULT_THEME);
  const [blendTo, setBlendTo] = useState(THEMES[1]?.name ?? DEFAULT_THEME);
  const [blend, setBlend] = useState(50);

  const applyDepth = (v: number) => {
    setDepth(v);
    const t = v / 100;
    setVar('--depth-distance', `${Math.round(lerp(0, 6, t))}px`);
    setVar('--depth-intensity', lerp(0.3, 1, t).toFixed(2));
  };
  const applyRound = (v: number) => {
    setRound(v);
    const t = v / 100;
    setVar('--radius-sm', `${Math.round(lerp(0, 16, t))}px`);
    setVar('--radius-md', `${Math.round(lerp(0, 28, t))}px`);
    setVar('--radius-lg', `${Math.round(lerp(0, 40, t))}px`);
  };
  const applyTempo = (v: number) => {
    setTempo(v);
    const t = v / 100;
    setVar('--anim-speed', `${lerp(0.5, 0.03, t).toFixed(2)}s`);
    setVar('--anim-speed-slow', `${lerp(1.4, 0.15, t).toFixed(2)}s`);
  };
  const applyScale = (v: number) => {
    setScale(v);
    const f = lerp(0.85, 1.35, v / 100);
    for (const [k, px] of FONT_BASE) setVar(k, `${Math.round(px * f)}px`);
  };
  // Blends every var the two presets set, key by key: colors mix as colors
  // (hex or rgba(), detected by shape), everything else mixes as a plain
  // number with its unit preserved. Same setVar-per-token pattern as the
  // dials above, just applied to a from/to pair instead of two fixed ends.
  const applyBlend = (from: string, to: string, v: number) => {
    setBlendFrom(from);
    setBlendTo(to);
    setBlend(v);
    const fromTheme = THEMES.find((p) => p.name === from);
    const toTheme = THEMES.find((p) => p.name === to);
    if (!fromTheme || !toTheme) return;
    const t = v / 100;
    const keys = new Set([
      ...Object.keys(fromTheme.vars),
      ...Object.keys(toTheme.vars),
    ]);
    for (const key of keys) {
      const a = fromTheme.vars[key];
      const b = toTheme.vars[key];
      if (a === undefined || b === undefined) continue;
      const blendFn =
        isColorValue(a) || isColorValue(b) ? blendColor : blendNumeric;
      setVar(key, blendFn(a, b, t));
    }
  };

  return (
    <Stack direction="col" gap="sm" className="skeu-fun-panel">
      <Heading level={3}>Make it yours</Heading>
      <Text size="sm">
        Big dials for the whole look. Pick a theme, then play. The full
        per-token controls live on the design system page.
      </Text>
      <PresetSelect
        label="Theme"
        presets={THEMES}
        active={activeTheme}
        vars={vars}
        onSelect={applyTheme}
      />
      <Heading level={4}>Theme blend</Heading>
      <Text size="sm">
        Mix two presets: colors blend as colors, sizes blend as numbers.
      </Text>
      <Stack direction="row" gap="sm">
        <Stack direction="col" gap="xxs">
          <Text as="span" size="sm">
            From
          </Text>
          <Select
            value={blendFrom}
            onValueChange={(v) => {
              applyBlend(v, blendTo, blend);
            }}
            options={THEME_OPTIONS}
          />
        </Stack>
        <Stack direction="col" gap="xxs">
          <Text as="span" size="sm">
            To
          </Text>
          <Select
            value={blendTo}
            onValueChange={(v) => {
              applyBlend(blendFrom, v, blend);
            }}
            options={THEME_OPTIONS}
          />
        </Stack>
      </Stack>
      <Slider
        label="Blend"
        value={blend}
        showValue
        unit="%"
        onChange={(e) => {
          applyBlend(blendFrom, blendTo, Number(e.target.value));
        }}
      />
      <Slider
        label="Depth"
        value={depth}
        onChange={(e) => {
          applyDepth(Number(e.target.value));
        }}
      />
      <Slider
        label="Roundness"
        value={round}
        onChange={(e) => {
          applyRound(Number(e.target.value));
        }}
      />
      <Slider
        label="Tempo"
        value={tempo}
        onChange={(e) => {
          applyTempo(Number(e.target.value));
        }}
      />
      <Slider
        label="Type scale"
        value={scale}
        onChange={(e) => {
          applyScale(Number(e.target.value));
        }}
      />
    </Stack>
  );
}
