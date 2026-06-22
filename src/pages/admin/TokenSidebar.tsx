import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CSSTokenMap, ElevationLevel, Preset } from '../../types/admin';
import { Button } from '../../components/atoms/Button';
import { Slider } from '../../components/atoms/Slider';
import {
  SidebarSection,
  ColorControl,
  RangeControl,
  ShadowControl,
} from './TokenControls';
import { PresetSelect } from './TokenPresets';
import { ButtonSidebarSection } from './ButtonSidebarSection';
import {
  COLOR_CONTROLS,
  SPACING_CONTROLS,
  RADII_CONTROLS,
  LINK_COLOR_CONTROLS,
  SHADOW_CONTROLS,
} from './token-sidebar-data';

export function TokenSidebar({
  vars,
  setVar,
  colorPresets,
  shapePresets,
  elevationPresets,
  activeColorPreset,
  applyColorPreset,
  activeShapePreset,
  applyShapePreset,
  elevationLevel,
  applyElevation,
  customElevation,
  setCustomElevation,
  recomputeDepthShadows,
  autoPopShadows,
  warmFound,
  warmKeys,
  autoFixWarmTones,
  dismissWarmTones,
  sidebarStyle,
}: {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  colorPresets: Preset[];
  shapePresets: Preset[];
  elevationPresets: Record<'low' | 'med' | 'high', string>;
  activeColorPreset: string | null;
  applyColorPreset: (name: string | null) => void;
  activeShapePreset: string | null;
  applyShapePreset: (name: string | null) => void;
  elevationLevel: ElevationLevel;
  applyElevation: (level: ElevationLevel) => void;
  customElevation: string;
  setCustomElevation: Dispatch<SetStateAction<string>>;
  recomputeDepthShadows: (angleDeg: number) => void;
  autoPopShadows: () => void;
  warmFound: boolean;
  warmKeys: string[];
  autoFixWarmTones: () => void;
  dismissWarmTones: () => void;
  sidebarStyle?: React.CSSProperties;
}) {
  return (
    <aside
      style={{
        width: 360,
        flexShrink: 0,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 180px)',
        paddingRight: 6,
        ...sidebarStyle,
      }}
    >
      <SidebarSection title="Presets" badge="preset">
        <PresetSelect
          label="Color preset"
          presets={colorPresets}
          active={activeColorPreset}
          vars={vars}
          onSelect={applyColorPreset}
        />
        <PresetSelect
          label="Shape preset"
          presets={shapePresets}
          active={activeShapePreset}
          vars={vars}
          onSelect={applyShapePreset}
        />
      </SidebarSection>

      <SidebarSection title="Colors" badge="global">
        {COLOR_CONTROLS.map((c) => (
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

      <SidebarSection title="Motion" badge="global">
        <Slider
          label="Anim speed"
          min={0}
          max={800}
          step={25}
          value={Math.round(
            (parseFloat(vars['--anim-speed'] ?? '0.12') || 0.12) * 1000,
          )}
          onChange={(e) => {
            setVar(
              '--anim-speed',
              `${(parseInt(e.target.value) / 1000).toFixed(2)}s`,
            );
          }}
          unit="ms"
          style={{ marginBottom: 8 }}
        />
      </SidebarSection>

      <SidebarSection title="Button" badge="atom">
        <ButtonSidebarSection
          vars={vars}
          setVar={setVar}
          elevationLevel={elevationLevel}
          applyElevation={applyElevation}
          customElevation={customElevation}
          setCustomElevation={setCustomElevation}
          elevationPresets={elevationPresets}
        />
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

      <SidebarSection
        title="Depth & Shadows"
        badge="global"
        defaultOpen={false}
      >
        <div className="preview-note" style={{ marginBottom: 8 }}>
          Color picker changes rgba() color only; offsets come from the angle.
          &#34;Auto&#34; derives both from the surface token.
        </div>
        <Slider
          label="Light angle"
          min={0}
          max={359}
          value={parseInt(vars['--shadow-angle'] ?? '315')}
          onChange={(e) => {
            recomputeDepthShadows(parseInt(e.target.value));
          }}
          unit="°"
          style={{ marginBottom: 8 }}
        />
        {SHADOW_CONTROLS.map((c) => (
          <ShadowControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
        <Button
          variant="outline"
          size="sm"
          style={{ marginTop: 4 }}
          onClick={autoPopShadows}
        >
          Auto from surface
        </Button>
      </SidebarSection>

      <SidebarSection title="Links" badge="atom">
        <div className="preview-note" style={{ marginBottom: 8 }}>
          <strong style={{ color: 'var(--color-text)' }}>Default</strong> —
          plain {'<a>'} tag text color only.
          <br />
          <strong style={{ color: 'var(--color-text)' }}>
            Hover / Active
          </strong>{' '}
          — all interactive elements.
        </div>
        {LINK_COLOR_CONTROLS.map((c) => (
          <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
      </SidebarSection>

      {warmFound && (
        <div
          style={{
            padding: 12,
            background: 'var(--color-surface)',
            border: '2px solid #e07b2a',
            borderRadius: 'var(--radius-md)',
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <strong style={{ color: 'var(--color-text)' }}>
            Warm tones detected
          </strong>
          <div
            style={{ fontSize: 12, marginTop: 4, color: 'var(--color-muted)' }}
          >
            {warmKeys.join(', ')}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={autoFixWarmTones}>
              Auto-fix
            </Button>
            <Button variant="outline" size="sm" onClick={dismissWarmTones}>
              Ignore
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
