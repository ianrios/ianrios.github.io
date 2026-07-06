import type { CSSTokenMap, Preset } from '../../types/admin';
import { Button } from '../../components/atoms/Button';
import { SidebarSection, TokenControlList } from './TokenControls';
import { PresetSelect } from './TokenPresets';
import { ButtonSidebarSection } from './ButtonSidebarSection';
import { controlList } from '../../styles/token-registry';
import {
  MotionSection,
  TypographySection,
  LayoutSection,
  DepthSection,
} from './TokenSidebarExtra';

const vn = (category: Parameters<typeof controlList>[0]): string[] =>
  controlList(category).map((c) => c.varName);

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
        <TokenControlList varNames={vn('color')} vars={vars} setVar={setVar} />
        <div className="skeu-control-sublabel">Chrome</div>
        <TokenControlList varNames={vn('chrome')} vars={vars} setVar={setVar} />
      </SidebarSection>
      <SidebarSection title="Spacing" badge="global" defaultOpen={false}>
        <TokenControlList
          varNames={vn('spacing')}
          vars={vars}
          setVar={setVar}
        />
      </SidebarSection>
      <SidebarSection title="Radii" badge="global" defaultOpen={false}>
        <TokenControlList varNames={vn('radii')} vars={vars} setVar={setVar} />
      </SidebarSection>
      <MotionSection vars={vars} setVar={setVar} />
      <TypographySection vars={vars} setVar={setVar} />
      <LayoutSection vars={vars} setVar={setVar} />
      <SidebarSection title="Button" badge="atom">
        <ButtonSidebarSection vars={vars} setVar={setVar} />
      </SidebarSection>
      <SidebarSection title="Focus" badge="atom" defaultOpen={false}>
        <TokenControlList varNames={vn('focus')} vars={vars} setVar={setVar} />
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
        <TokenControlList varNames={vn('link')} vars={vars} setVar={setVar} />
      </SidebarSection>
    </aside>
  );
}
