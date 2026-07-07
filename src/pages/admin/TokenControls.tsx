import { useState } from 'react';
import type React from 'react';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Slider } from '../../components/atoms/Slider';
import { ValueInput } from '../../components/atoms/ValueInput';
import { ColorPicker } from '../../components/atoms/ColorPicker';
import { isHexColor } from './colorUtils';
import { msVal, pctVal, numVal } from './sliderValue';
import { getControl, REGISTRY_DEFAULTS } from '../../styles/token-registry';
import type { CSSTokenMap } from '../../types/admin';

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
    <div className="skeu-sidebar-section">
      <button
        onClick={() => {
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        className="skeu-accordion-btn"
      >
        <span className="skeu-sidebar-section__trigger-inner">
          <span className="skeu-sidebar-section__badge">
            <Badge size="xs">{badge}</Badge>
          </span>
          <span className="skeu-sidebar-section__title">{title}</span>
        </span>
        <Icon name={open ? 'chevron-down' : 'chevron-up'} size={11} />
      </button>
      {open && <div className="skeu-sidebar-section__body">{children}</div>}
    </div>
  );
}

function ColorRow({
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
    <div className="skeu-control-row skeu-control-row--flex">
      <span className="skeu-control-label">{label}</span>
      <ColorPicker
        value={isHex ? raw.trim() : '#000000'}
        onChange={(e) => {
          setVar(varName, e.target.value);
        }}
        title={varName}
      />
      <div className="skeu-control-value">
        <ValueInput
          value={raw}
          onChange={(e) => {
            setVar(varName, e.target.value);
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// The control engine: ONE renderer interprets the registry's control
// descriptor. The registry entry is the policy (type/label/min/max/step/unit);
// the pure converters in sliderValue.ts are the mechanism. Each non-color type
// is a codec: slider position -> stored CSS string, and back.
function TokenControl({
  varName,
  vars,
  setVar,
}: {
  varName: string;
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}) {
  const c = getControl(varName);
  if (!c) return null;
  if (c.type === 'color') {
    return (
      <ColorRow label={c.label} varName={varName} vars={vars} setVar={setVar} />
    );
  }
  const fallback = parseFloat(REGISTRY_DEFAULTS[varName] ?? '') || 0;
  const raw = vars[varName];
  const codecs = {
    range: {
      value: numVal(raw, fallback),
      store: (v: string) => `${v}px`,
      unit: c.unit ?? 'px',
    },
    raw: {
      value: numVal(raw, fallback),
      store: (v: string) => v,
      unit: c.unit ?? '',
    },
    ms: {
      value: msVal(raw, fallback),
      store: (v: string) => `${(parseInt(v) / 1000).toFixed(2)}s`,
      unit: c.unit ?? 'ms',
    },
    pct: {
      value: pctVal(raw, fallback),
      store: (v: string) => (parseInt(v) / 100).toFixed(2),
      unit: c.unit ?? '%',
    },
  };
  const codec = codecs[c.type];
  return (
    <div className="skeu-control-row">
      <Slider
        label={c.label}
        min={c.min ?? 0}
        max={c.max ?? 100}
        step={c.step ?? 1}
        value={codec.value}
        onChange={(e) => {
          setVar(varName, codec.store(e.target.value));
        }}
        unit={codec.unit}
      />
    </div>
  );
}

/** A TokenControl per var, in the given (registry) order. */
export function TokenControlList({
  varNames,
  vars,
  setVar,
}: {
  varNames: string[];
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}) {
  return (
    <>
      {varNames.map((v) => (
        <TokenControl key={v} varName={v} vars={vars} setVar={setVar} />
      ))}
    </>
  );
}
