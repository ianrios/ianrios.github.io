import type { CSSTokenMap, Preset } from '../../types/admin';
import { Button } from '../../components/atoms/Button';
import { SidebarSection, ColorControl, RangeControl } from './TokenControls';
import { PresetSelect } from './TokenPresets';
import { ButtonSidebarSection } from './ButtonSidebarSection';
import {
  COLOR_CONTROLS,
  CHROME_CONTROLS,
  SPACING_CONTROLS,
  RADII_CONTROLS,
  LINK_COLOR_CONTROLS,
} from './token-sidebar-data';
import {
  MotionSection,
  TypographySection,
  LayoutSection,
  DepthSection,
} from './TokenSidebarExtra';

export function TokenSidebar({
  vars,
  setVar,
  themes,
  activeTheme,
  applyTheme,
  resetAll,
}: {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  themes: Preset[];
  activeTheme: string | null;
  applyTheme: (name: string | null) => void;
  resetAll: () => void;
}) {
  return (
    <aside className="skeu-admin-sidebar">
      <SidebarSection title="Themes" badge="preset">
        <PresetSelect
          label="Theme"
          presets={themes}
          active={activeTheme}
          vars={vars}
          onSelect={applyTheme}
        />
        <div className="skeu-control-row">
          <Button variant="outline" size="sm" onClick={resetAll}>
            Reset to defaults
          </Button>
        </div>
      </SidebarSection>
      <SidebarSection title="Colors" badge="global">
        {COLOR_CONTROLS.map((c) => (
          <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
        <div className="skeu-control-sublabel">Chrome</div>
        {CHROME_CONTROLS.map((c) => (
          <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
      </SidebarSection>
      <SidebarSection title="Spacing" badge="global" defaultOpen={false}>
        {SPACING_CONTROLS.map((c) => (
          <RangeControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
      </SidebarSection>
      <SidebarSection title="Radii" badge="global" defaultOpen={false}>
        {RADII_CONTROLS.map((c) => (
          <RangeControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
      </SidebarSection>
      <MotionSection vars={vars} setVar={setVar} />
      <TypographySection vars={vars} setVar={setVar} />
      <LayoutSection vars={vars} setVar={setVar} />
      <SidebarSection title="Button" badge="atom">
        <ButtonSidebarSection vars={vars} setVar={setVar} />
      </SidebarSection>
      <SidebarSection title="Focus" badge="atom" defaultOpen={false}>
        <ColorControl
          label="Focus ring"
          varName="--focus-ring-color"
          vars={vars}
          setVar={setVar}
        />
        <RangeControl
          label="Ring width"
          varName="--focus-ring-width"
          vars={vars}
          setVar={setVar}
          min={0}
          max={12}
        />
      </SidebarSection>
      <SidebarSection title="Bevel" badge="global" defaultOpen={false}>
        <div className="skeu-preview-note skeu-control-row">
          Classic Windows 3D bevels. The four tone colors derive from{' '}
          <strong>Background</strong> (page-level) and <strong>Surface</strong>{' '}
          (in-card) by lightness, scaled by the Depth contrast slider, so every
          control&#39;s edges blend into whatever it sits on. They re-derive
          automatically whenever those values change.
        </div>
      </SidebarSection>
      <DepthSection vars={vars} setVar={setVar} />
      <SidebarSection title="Links" badge="atom">
        <div className="skeu-preview-note skeu-control-row">
          <strong>Default</strong>: anchor text and the default button color
          axis.
          <br />
          <strong>Hover / Active</strong>: all interactive elements.
        </div>
        {LINK_COLOR_CONTROLS.map((c) => (
          <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
      </SidebarSection>
    </aside>
  );
}
