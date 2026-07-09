import { TOKEN_REGISTRY } from '../../styles/token-registry';
import { Select } from '../../components/atoms/Select';
import type { CSSTokenMap, Preset } from '../../types/admin';

// Every color-type control, in registry order — the same palette the Design
// Tokens view shows. Swatches read the live `vars` map (theme + user edits)
// so they always mirror the applied state.
const SWATCH_KEYS = TOKEN_REGISTRY.filter(
  (t) => t.control?.type === 'color',
).map((t) => t.cssVar);

function ColorSwatches({ vars }: { vars: CSSTokenMap }) {
  const colors = SWATCH_KEYS.map(
    (k) => [k, (vars[k] ?? '').trim()] as const,
  ).filter(([, v]) => v !== '');
  if (colors.length === 0) return null;
  return (
    <div className="skeu-preset-swatches">
      {colors.map(([k, c]) => (
        <div
          key={k}
          title={`${k}: ${c}`}
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
        <Select
          value={active ?? ''}
          onValueChange={(v) => {
            onSelect(v || null);
          }}
          options={[
            { value: '', label: 'choose a theme' },
            ...presets.map((p) => ({ value: p.name, label: p.name })),
          ]}
        />
      </div>
      <ColorSwatches vars={vars} />
    </div>
  );
}
