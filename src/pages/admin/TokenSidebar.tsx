import { Button } from '../../components/atoms/Button';
import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CSSTokenMap, ElevationLevel, Preset } from '../../types/admin';
import { Slider } from '../../components/atoms/Slider';
import { ValueInput } from '../../components/atoms/ValueInput';
import {
  SidebarSection,
  ColorControl,
  RangeControl,
  ShadowControl,
  PresetSelect,
} from './TokenControls';

const COLOR_CONTROLS = [
  { label: 'Background', varName: '--color-bg' },
  { label: 'Surface', varName: '--color-surface' },
  { label: 'Accent', varName: '--color-accent' },
  { label: 'Muted', varName: '--color-muted' },
  { label: 'Text', varName: '--color-text' },
];

const SPACING_CONTROLS = [
  { label: 'XXS — badge, tiny', varName: '--space-xxs', min: 1, max: 12 },
  { label: 'XS — gaps, icons', varName: '--space-xs', min: 2, max: 20 },
  { label: 'SM — input, nav', varName: '--space-sm', min: 4, max: 48 },
  { label: 'MD — card pad, gap', varName: '--space-md', min: 4, max: 64 },
  { label: 'LG — page, btn-lg', varName: '--space-lg', min: 8, max: 80 },
];

const RADII_CONTROLS = [
  { label: 'Radius SM', varName: '--radius-sm', min: 0, max: 24 },
  { label: 'Radius MD', varName: '--radius-md', min: 0, max: 40 },
  { label: 'Radius LG', varName: '--radius-lg', min: 0, max: 48 },
];

const BTN_COLOR_CONTROLS = [
  { label: 'Fill text', varName: '--btn-text-color' },
  { label: 'Gradient start', varName: '--btn-gradient-start' },
  { label: 'Gradient end', varName: '--btn-gradient-end' },
];

const BTN_SHAPE_CONTROLS = [
  { label: 'Radius', varName: '--btn-radius', min: 0, max: 50 },
  { label: 'Padding Y', varName: '--btn-padding-y', min: 0, max: 24 },
  { label: 'Padding X', varName: '--btn-padding-x', min: 0, max: 64 },
];

const LINK_COLOR_CONTROLS = [
  { label: 'Default (anchors)', varName: '--link-color' },
  { label: 'Hover', varName: '--link-hover' },
  { label: 'Active', varName: '--link-active' },
];

const SHADOW_CONTROLS = [
  { label: 'Pop highlight', varName: '--pop-shadow-light' },
  { label: 'Pop shadow', varName: '--pop-shadow-dark' },
  { label: 'Active highlight', varName: '--inset-shadow-highlight' },
];

const SUB_LABEL = {
  fontSize: 11,
  color: 'var(--color-muted)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
};

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
        <div style={{ ...SUB_LABEL, marginBottom: 8 }}>Color</div>
        {BTN_COLOR_CONTROLS.map((c) => (
          <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
        <div style={{ ...SUB_LABEL, marginTop: 14, marginBottom: 8 }}>
          Shape
        </div>
        {BTN_SHAPE_CONTROLS.map((c) => (
          <RangeControl key={c.varName} {...c} vars={vars} setVar={setVar} />
        ))}
        <div style={{ ...SUB_LABEL, marginTop: 14, marginBottom: 8 }}>
          Elevation
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {(['low', 'med', 'high', 'custom'] as const).map((level) => (
            <Button
              key={level}
              variant={elevationLevel === level ? 'primary' : 'outline'}
              size="xs"
              onClick={() => {
                applyElevation(level);
              }}
            >
              {level}
            </Button>
          ))}
        </div>
        {elevationLevel === 'custom' && (
          <ValueInput
            value={customElevation}
            onChange={(e) => {
              setCustomElevation(e.target.value);
              setVar('--btn-elevation', e.target.value);
            }}
            placeholder="e.g. 0 12px 24px rgba(0,0,0,0.15)"
            spellCheck={false}
            style={{ width: '100%', marginBottom: 6 }}
          />
        )}
        <div
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            marginBottom: 8,
            wordBreak: 'break-all',
            color: 'var(--color-muted)',
          }}
        >
          {vars['--btn-elevation']}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-xs) var(--space-lg)',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(128,128,128,0.10)',
          }}
        >
          {Object.entries(elevationPresets).map(([lvl, shadow]) => (
            <div
              key={lvl}
              style={{
                flex: 1,
                padding: 'var(--space-sm)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: shadow,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                {lvl}
              </div>
            </div>
          ))}
        </div>
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
