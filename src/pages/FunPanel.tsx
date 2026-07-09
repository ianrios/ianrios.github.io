import { useState } from 'react';
import { useDesignVars } from '../hooks/designVarsContext';
import { THEMES } from './admin/adminData';
import { PresetSelect } from './admin/TokenPresets';
import { Slider } from '../components/atoms/Slider';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { Stack } from '../components/atoms/Stack';

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
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
