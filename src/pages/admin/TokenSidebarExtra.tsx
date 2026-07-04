import type { CSSTokenMap } from '../../types/admin';
import { Slider } from '../../components/atoms/Slider';
import { SidebarSection, RangeControl } from './TokenControls';
import { getControl } from '../../styles/token-registry';
import { FONT_CONTROLS } from './token-sidebar-data';
import { msVal, pctVal, numVal } from './sliderValue';

// Pull the registry control for a slider; labels/min/max/step come from there.
function ctl(cssVar: string) {
  const c = getControl(cssVar);
  return {
    label: c?.label ?? cssVar,
    min: c?.min ?? 0,
    max: c?.max ?? 100,
    step: c?.step ?? 1,
    unit: c?.unit ?? '',
  };
}

interface SectionProps {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}

function MsSlider({
  cssVar,
  fallback,
  vars,
  setVar,
}: SectionProps & { cssVar: string; fallback: number }) {
  const c = ctl(cssVar);
  return (
    <Slider
      label={c.label}
      min={c.min}
      max={c.max}
      step={c.step}
      value={msVal(vars[cssVar], fallback)}
      onChange={(e) => {
        setVar(cssVar, `${(parseInt(e.target.value) / 1000).toFixed(2)}s`);
      }}
      unit={c.unit}
    />
  );
}

function PctSlider({
  cssVar,
  fallback,
  vars,
  setVar,
}: SectionProps & { cssVar: string; fallback: number }) {
  const c = ctl(cssVar);
  return (
    <Slider
      label={c.label}
      min={c.min}
      max={c.max}
      step={c.step}
      value={pctVal(vars[cssVar], fallback)}
      onChange={(e) => {
        setVar(cssVar, (parseInt(e.target.value) / 100).toFixed(2));
      }}
      unit={c.unit}
    />
  );
}

function PxSlider({
  cssVar,
  fallback,
  vars,
  setVar,
}: SectionProps & { cssVar: string; fallback: number }) {
  const c = ctl(cssVar);
  return (
    <Slider
      label={c.label}
      min={c.min}
      max={c.max}
      step={c.step}
      value={numVal(vars[cssVar], fallback)}
      onChange={(e) => {
        setVar(cssVar, `${e.target.value}px`);
      }}
      unit={c.unit || 'px'}
    />
  );
}

// Raw decimal slider — stores the unitless number verbatim (intensity 0–1,
// contrast 0.5–2), unlike PxSlider which appends "px".
function RawSlider({
  cssVar,
  fallback,
  vars,
  setVar,
}: SectionProps & { cssVar: string; fallback: number }) {
  const c = ctl(cssVar);
  return (
    <Slider
      label={c.label}
      min={c.min}
      max={c.max}
      step={c.step}
      value={numVal(vars[cssVar], fallback)}
      onChange={(e) => {
        setVar(cssVar, e.target.value);
      }}
      unit={c.unit}
    />
  );
}

export function DepthSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Depth" badge="global" defaultOpen={false}>
      <div className="skeu-preview-note skeu-control-row">
        Parametric bevel geometry shared by every control.{' '}
        <strong>Blur 0</strong> = hard Win95 bevel; raise it for soft
        neumorphism. Contrast scales the tone lightness; intensity scales the
        shadow alpha.
      </div>
      <PxSlider
        cssVar="--depth-distance"
        fallback={2}
        vars={vars}
        setVar={setVar}
      />
      <PxSlider
        cssVar="--depth-blur"
        fallback={3}
        vars={vars}
        setVar={setVar}
      />
      <RawSlider
        cssVar="--depth-intensity"
        fallback={0.6}
        vars={vars}
        setVar={setVar}
      />
      <RawSlider
        cssVar="--depth-contrast"
        fallback={1}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function MotionSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Motion" badge="global">
      <MsSlider
        cssVar="--anim-speed"
        fallback={0.12}
        vars={vars}
        setVar={setVar}
      />
      <MsSlider
        cssVar="--anim-speed-slow"
        fallback={0.5}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function TypographySection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Typography" badge="global" defaultOpen={false}>
      {FONT_CONTROLS.map((c) => (
        <RangeControl key={c.varName} {...c} vars={vars} setVar={setVar} />
      ))}
      <PctSlider
        cssVar="--line-height-base"
        fallback={1.5}
        vars={vars}
        setVar={setVar}
      />
      <PctSlider
        cssVar="--line-height-loose"
        fallback={1.6}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}

export function LayoutSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Layout" badge="global" defaultOpen={false}>
      <PxSlider
        cssVar="--sidebar-width"
        fallback={220}
        vars={vars}
        setVar={setVar}
      />
      <PxSlider
        cssVar="--drawer-width"
        fallback={280}
        vars={vars}
        setVar={setVar}
      />
      <PxSlider
        cssVar="--modal-max-width"
        fallback={700}
        vars={vars}
        setVar={setVar}
      />
    </SidebarSection>
  );
}
