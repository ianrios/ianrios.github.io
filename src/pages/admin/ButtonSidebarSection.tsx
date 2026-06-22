import type { Dispatch, SetStateAction } from 'react';
import { Button } from '../../components/atoms/Button';
import { ValueInput } from '../../components/atoms/ValueInput';
import { ColorControl, RangeControl } from './TokenControls';
import {
  BTN_COLOR_CONTROLS,
  BTN_SHAPE_CONTROLS,
  SUB_LABEL,
} from './token-sidebar-data';
import type { CSSTokenMap, ElevationLevel } from '../../types/admin';

export function ButtonSidebarSection({
  vars,
  setVar,
  elevationLevel,
  applyElevation,
  customElevation,
  setCustomElevation,
  elevationPresets,
}: {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  elevationLevel: ElevationLevel;
  applyElevation: (level: ElevationLevel) => void;
  customElevation: string;
  setCustomElevation: Dispatch<SetStateAction<string>>;
  elevationPresets: Record<'low' | 'med' | 'high', string>;
}) {
  return (
    <>
      <div style={{ ...SUB_LABEL, marginBottom: 8 }}>Color</div>
      {BTN_COLOR_CONTROLS.map((c) => (
        <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
      ))}
      <div style={{ ...SUB_LABEL, marginTop: 14, marginBottom: 8 }}>Shape</div>
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
    </>
  );
}
