import { useState } from 'react';
import type { CSSTokenMap } from '../../types/admin';
import { SidebarSection, TokenControlList } from './TokenControls';
import { Slider } from '../../components/atoms/Slider';
import { controlList } from '../../styles/token-registry';

interface SectionProps {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const FONT_BASE: [string, number][] = [
  ['--font-xxs', 12],
  ['--font-xs', 14],
  ['--font-sm', 16],
  ['--font-base', 18],
  ['--font-lg', 22],
  ['--font-xl', 28],
];

const varNames = (category: Parameters<typeof controlList>[0]): string[] =>
  controlList(category).map((c) => c.varName);

export function DepthSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Depth & bevel" badge="global" defaultOpen={false}>
      <div className="skeu-preview-note skeu-control-row">
        Parametric bevel geometry shared by every control.{' '}
        <strong>Blur 0</strong> = hard Win95 bevel; raise it for soft
        neumorphism. Contrast scales the tone lightness; intensity scales the
        shadow alpha. The four bevel tone colors are derived automatically from
        Background and Surface, so there are no separate bevel controls.
      </div>
      <TokenControlList
        varNames={varNames('depth')}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function MotionSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Motion" badge="global">
      <TokenControlList
        varNames={varNames('motion')}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function TypographySection({ vars, setVar }: SectionProps) {
  const [scale, setScale] = useState(50);

  const applyScale = (v: number) => {
    setScale(v);
    const f = lerp(0.85, 1.35, v / 100);
    for (const [k, px] of FONT_BASE) setVar(k, `${Math.round(px * f)}px`);
  };

  return (
    <SidebarSection title="Typography" badge="global" defaultOpen={false}>
      <Slider
        label="Type scale"
        value={scale}
        onChange={(e) => {
          applyScale(Number(e.target.value));
        }}
      />
      <TokenControlList
        varNames={varNames('font')}
        vars={vars}
        setVar={setVar}
      />
      <div className="skeu-control-sublabel">Weight</div>
      <TokenControlList
        varNames={varNames('font-weight')}
        vars={vars}
        setVar={setVar}
      />
      <TokenControlList
        varNames={varNames('line-height')}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function LayoutSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Layout" badge="global" defaultOpen={false}>
      <TokenControlList
        varNames={varNames('layout')}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}
