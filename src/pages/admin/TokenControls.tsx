import { useState } from 'react';
import type React from 'react';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Slider } from '../../components/atoms/Slider';
import { ValueInput } from '../../components/atoms/ValueInput';
import { ColorPicker } from '../../components/atoms/ColorPicker';
import { isHexColor } from './colorUtils';
import { numVal } from './sliderValue';
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
  const val = numVal(vars[varName], min);
  return (
    <div className="skeu-control-row">
      <Slider
        label={label}
        min={min}
        max={max}
        value={val}
        onChange={(e) => {
          setVar(varName, `${e.target.value}px`);
        }}
        unit="px"
      />
    </div>
  );
}
