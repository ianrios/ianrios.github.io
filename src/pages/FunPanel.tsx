import { useState } from 'react';
import { useDesignVars } from '../hooks/designVarsContext';
import { Slider } from '../components/atoms/Slider';
import { Heading } from '../components/atoms/Heading';
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

// The non-designer panel (portfolio/about). Presets live in the separate
// floating PresetDial, not here - this is just whatever's left: a single
// master control. Full per-token controls live on the design system page.
export function FunPanel() {
  const { setVar } = useDesignVars();
  const [scale, setScale] = useState(50);

  const applyScale = (v: number) => {
    setScale(v);
    const f = lerp(0.85, 1.35, v / 100);
    for (const [k, px] of FONT_BASE) setVar(k, `${Math.round(px * f)}px`);
  };

  return (
    <Stack direction="col" gap="sm" className="skeu-fun-panel">
      <Heading level={3}>design</Heading>
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
