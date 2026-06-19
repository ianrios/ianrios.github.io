import { useState } from 'react';
import type React from 'react';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Slider } from '../../components/atoms/Slider';
import { ValueInput } from '../../components/atoms/ValueInput';
import { ColorPicker } from '../../components/atoms/ColorPicker';
import { isHexColor, hexToRgb } from './colorUtils';
import type { CSSTokenMap, Preset } from '../../types/admin';

export function SidebarSection({
  title,
  badge,
  children,
  defaultOpen = true,
}: {
  title: string;
  badge?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        marginBottom: 6,
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(128,128,128,0.14)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => {
          setOpen((o) => !o);
        }}
        className="skeu-accordion-btn"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Badge style={{ flexShrink: 0, fontSize: 9, padding: '1px 6px' }}>
            {badge}
          </Badge>
          <span style={{ fontWeight: 600 }}>{title}</span>
        </span>
        <Icon name={open ? 'chevron-down' : 'chevron-up'} size={11} />
      </button>
      {open && (
        <div
          style={{
            padding: '10px 12px 14px',
            borderTop: '1px solid rgba(128,128,128,0.10)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ColorControl({
  label,
  varName,
  vars,
  setVar,
}: {
  label: string;
  varName: string;
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}) {
  const raw = vars[varName] ?? '';
  const isHex = isHexColor(raw.trim());
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
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
      </span>
      <ColorPicker
        value={isHex ? raw.trim() : '#000000'}
        onChange={(e) => {
          setVar(varName, e.target.value);
        }}
        title={varName}
      />
      <ValueInput
        value={raw}
        onChange={(e) => {
          setVar(varName, e.target.value);
        }}
        spellCheck={false}
        style={{ flex: 1 }}
      />
    </div>
  );
}

export function RangeControl({
  label,
  varName,
  vars,
  setVar,
  min = 0,
  max,
}: {
  label: string;
  varName: string;
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
  min?: number;
  max: number;
}) {
  const val = parseInt(vars[varName] ?? '0') || 0;
  return (
    <Slider
      label={label}
      min={min}
      max={max}
      value={val}
      onChange={(e) => {
        setVar(varName, `${e.target.value}px`);
      }}
      unit="px"
      style={{ marginBottom: 8 }}
    />
  );
}

export function ShadowControl({
  label,
  varName,
  vars,
  setVar,
}: {
  label: string;
  varName: string;
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}) {
  const val = vars[varName] ?? '';
  const rgbMatch = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(val);
  const hexColor = rgbMatch
    ? `#${parseInt(rgbMatch[1] ?? '0')
        .toString(16)
        .padStart(2, '0')}${parseInt(rgbMatch[2] ?? '0')
        .toString(16)
        .padStart(2, '0')}${parseInt(rgbMatch[3] ?? '0')
        .toString(16)
        .padStart(2, '0')}`
    : '#888888';
  const handleColorPick = (newHex: string) => {
    const rgb = hexToRgb(newHex);
    if (!rgb) return;
    const updated = val.replace(
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i,
      `rgba(${rgb.join(',')}`,
    );
    setVar(varName, updated || val);
  };
  return (
    <div style={{ marginBottom: 8 }}>
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
        </span>
        <ColorPicker
          value={hexColor}
          onChange={(e) => {
            handleColorPick(e.target.value);
          }}
          title="Pick color (preserves alpha & offsets)"
        />
        <span
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: 'var(--color-muted)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {hexColor}
        </span>
      </div>
      <ValueInput
        value={val}
        onChange={(e) => {
          setVar(varName, e.target.value);
        }}
        spellCheck={false}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export function ColorSwatches({
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
