import { isHexColor } from './colorUtils';
import { categoryVars } from '../../styles/token-registry';
import type { CSSTokenMap, Preset } from '../../types/admin';

// The core palette tokens, in registry order. Swatches read these from the live
// `vars` map so edits preview immediately, with or without an active preset.
const SWATCH_KEYS = categoryVars('color');

function ColorSwatches({ vars }: { vars: CSSTokenMap }) {
  const colors = SWATCH_KEYS.map((k) => (vars[k] ?? '').trim()).filter(
    isHexColor,
  );
  if (colors.length === 0) return null;
  return (
    <div className="skeu-preset-swatches">
      {colors.map((c, i) => (
        <div
          key={i}
          title={c}
          className="skeu-preset-swatch"
          style={{ background: c }}
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
    <div className="skeu-preset-row">
      <div className="skeu-preset-header">
        <span className="skeu-preset-label">
          {label}
          {isDirty && (
            <span title="Modified" className="skeu-preset-dirty">
              *
            </span>
          )}
        </span>
        <select
          className="skeu-preset-select"
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
      <ColorSwatches vars={vars} />
    </div>
  );
}
