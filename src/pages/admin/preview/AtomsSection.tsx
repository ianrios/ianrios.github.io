import { useState } from 'react';
import { Badge } from '../../../components/atoms/Badge';
import { Input } from '../../../components/atoms/Input';
import { Slider } from '../../../components/atoms/Slider';
import { ValueInput } from '../../../components/atoms/ValueInput';
import { ColorPicker } from '../../../components/atoms/ColorPicker';
import { SectionLabel, TierLabel } from '../AdminUI';
import { LINK_STYLES, LINK_COLORS } from './button-helpers-data';
import { BADGE_SAMPLES } from '../adminData';
import { ButtonAtoms } from './ButtonAtoms';
import { IconAtoms } from './IconAtoms';
import '../preview.scss';

export function AtomsSection() {
  const [sliderVal, setSliderVal] = useState(40);
  const [inputVal, setInputVal] = useState('#39ff14');

  return (
    <>
      <TierLabel>Atoms</TierLabel>

      <ButtonAtoms />

      <SectionLabel>Badge</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        {BADGE_SAMPLES.map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
        <Badge href="https://github.com/ianrios">linked badge</Badge>
      </div>

      <IconAtoms />

      <SectionLabel>Link — all combinations (style × color)</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(4, 1fr)',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-xs)',
          }}
        >
          <div style={{ fontSize: 10, color: 'var(--color-muted)' }} />
          {LINK_COLORS.map(({ label }) => (
            <div
              key={label}
              style={{
                fontSize: 10,
                color: 'var(--color-muted)',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        {LINK_STYLES.map(({ label, variantClass }) => (
          <div
            key={label}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px repeat(4, 1fr)',
              gap: 'var(--space-xs)',
              alignItems: 'center',
              marginBottom: 'var(--space-xs)',
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--color-muted)' }}>
              {label}
            </div>
            {LINK_COLORS.map(({ label: colorLabel, colorClass }) => {
              const cls = ['skeu-link', variantClass, colorClass]
                .filter(Boolean)
                .join(' ');
              return (
                <div
                  key={colorLabel}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <a href="#demo" className={cls} style={{ fontSize: 12 }}>
                    link
                  </a>
                </div>
              );
            })}
          </div>
        ))}
        <div className="preview-note" style={{ marginTop: 'var(--space-xs)' }}>
          Style: surface = button-look · text = plain underline · ghost = color
          only
          <br />
          Color: default = <code>--link-color</code> · muted · accent · primary
          <br />
          Hover/active on all variants = <code>--link-hover</code> /{' '}
          <code>--link-active</code>
        </div>
      </div>

      <SectionLabel>Input</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <Input
          placeholder="Text input (tab to see focus ring)"
          style={{ width: 300 }}
        />
      </div>

      <SectionLabel>ValueInput — compact token editor input</SectionLabel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-md)',
          maxWidth: 340,
        }}
      >
        <ValueInput
          label="Hex color"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
        />
        <ValueInput
          label="Elevation"
          value="0 8px 20px rgba(0,0,0,0.14)"
          onChange={() => undefined}
        />
        <ValueInput
          label="Duration"
          value="0.12"
          suffix="s"
          onChange={() => undefined}
        />
      </div>

      <SectionLabel>Slider — custom range input atom</SectionLabel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
          maxWidth: 340,
        }}
      >
        <Slider
          label="Opacity"
          min={0}
          max={100}
          value={sliderVal}
          onChange={(e) => {
            setSliderVal(Number(e.target.value));
          }}
          unit="%"
        />
        <Slider
          label="Radius"
          min={0}
          max={48}
          value={12}
          onChange={() => undefined}
          unit="px"
        />
        <Slider
          label="Speed"
          min={0}
          max={800}
          step={25}
          value={120}
          onChange={() => undefined}
          unit="ms"
        />
      </div>

      <SectionLabel>ColorPicker — styled color input atom</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        <ColorPicker value="#39ff14" onChange={() => undefined} title="Green" />
        <ColorPicker value="#4da6ff" onChange={() => undefined} title="Blue" />
        <ColorPicker value="#ff4444" onChange={() => undefined} title="Red" />
        <ColorPicker
          value="#ffdd00"
          onChange={() => undefined}
          title="Yellow"
        />
        <span className="preview-note">
          border = --border-color · radius = --radius-sm · hover/active = link
          tokens
        </span>
      </div>
    </>
  );
}
