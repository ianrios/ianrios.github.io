import { isHexColor } from './colorUtils';
import type { CSSTokenMap, Preset } from '../../types/admin';

function ColorSwatches({
  presetName,
  presets,
}: {
  presetName: string | null;
  presets: Preset[];
}) {
  const preset = presets.find((p) => p.name === presetName);
  if (!preset) return null;
  const hexColors = Object.values(preset.vars).filter((v) =>
    isHexColor((v || '').trim()),
  );
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 4, marginBottom: 4 }}>
      {hexColors.map((c, i) => (
        <div
          key={i}
          title={c}
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: c,
            border: '1px solid rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export function PresetSelect({
  label,
  presets,
  active,
  vars,
  onSelect,
}: {
  label: string;
  presets: Preset[];
  active: string | null;
  vars: CSSTokenMap;
  onSelect: (name: string | null) => void;
}) {
  const preset = presets.find((p) => p.name === active);
  const isDirty =
    preset != null &&
    Object.entries(preset.vars).some(([k, v]) => vars[k] !== v);
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            width: 120,
            flexShrink: 0,
            fontSize: 12,
            color: 'var(--color-text)',
          }}
        >
          {label}
          {isDirty && (
            <span
              title="Modified"
              style={{
                marginLeft: 5,
                color: '#e07b2a',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              *
            </span>
          )}
        </span>
        <select
          style={{
            flex: 1,
            fontSize: 13,
            padding: '4px 6px',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid rgba(128,128,128,0.25)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
          value={active ?? ''}
          onChange={(e) => {
            onSelect(e.target.value || null);
          }}
        >
          <option value="">— choose —</option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <ColorSwatches presetName={active} presets={presets} />
    </div>
  );
}
