import type { CSSTokenMap } from '../../types/admin';
import { SidebarSection, TokenControlList } from './TokenControls';
import { controlList } from '../../styles/token-registry';

interface SectionProps {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}

const varNames = (category: Parameters<typeof controlList>[0]): string[] =>
  controlList(category).map((c) => c.varName);

export function DepthSection({ vars, setVar }: SectionProps) {
  return (
    <SidebarSection title="Depth" badge="global" defaultOpen={false}>
      <div className="skeu-preview-note skeu-control-row">
        Parametric bevel geometry shared by every control.{' '}
        <strong>Blur 0</strong> = hard Win95 bevel; raise it for soft
        neumorphism. Contrast scales the tone lightness; intensity scales the
        shadow alpha.
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
  return (
    <SidebarSection title="Typography" badge="global" defaultOpen={false}>
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
