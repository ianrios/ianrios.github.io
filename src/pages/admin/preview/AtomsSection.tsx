import { useState } from 'react';
import { Badge } from '../../../components/atoms/Badge';
import { Icon } from '../../../components/atoms/Icon';
import { Input } from '../../../components/atoms/Input';
import { Slider } from '../../../components/atoms/Slider';
import { ValueInput } from '../../../components/atoms/ValueInput';
import { ColorPicker } from '../../../components/atoms/ColorPicker';
import { Switch } from '../../../components/atoms/Switch';
import { Button } from '../../../components/atoms/Button';
import { SectionLabel, TierLabel } from '../AdminUI';
import { BADGE_SAMPLES } from '../adminData';

const BUTTON_VARIANTS = [
  'solid',
  'outline',
  'surface',
  'chisel',
  'ghost',
] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
const BUTTON_COLORS = ['default', 'muted', 'accent', 'primary'] as const;
const ICON_SAMPLES = ['send', 'github', 'info', 'external', 'plus', 'close'];

export function AtomsSection() {
  const [sliderVal, setSliderVal] = useState(40);
  const [inputVal, setInputVal] = useState('#39ff14');
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <>
      <TierLabel>Atoms</TierLabel>

      <SectionLabel>
        Button — variant × size · button / link / icon-only
      </SectionLabel>
      <div className="skeu-preview-section">
        {BUTTON_VARIANTS.map((variant) => (
          <div key={variant} className="skeu-btn-size-group">
            <div className="skeu-btn-size-sublabel">{variant}</div>
            <div className="skeu-preview-flex skeu-preview-flex--end">
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size} text={size} />
              ))}
              <Button
                variant={variant}
                icon="send"
                aria-label={`${variant} icon-only`}
              />
              <Button variant={variant} as="link" href="/admin" text="link" />
            </div>
          </div>
        ))}
        <div className="skeu-preview-note">
          solid fill · outline bevel · surface smooth→border · chisel
          smooth→hard-bevel · ghost bare · <code>underline</code> optional.
        </div>
      </div>

      <SectionLabel>Button — color axis (outline) · disabled</SectionLabel>
      <div className="skeu-preview-section">
        <div className="skeu-preview-flex">
          {BUTTON_COLORS.map((color) => (
            <Button key={color} variant="outline" color={color} text={color} />
          ))}
        </div>
        <div className="skeu-preview-flex skeu-preview-flex--end skeu-mt-md">
          <Button variant="ghost" underline text="underline" />
          <Button as="link" href="/admin" underline text="link underline" />
          <Button variant="outline" disabled text="disabled" />
          <Button as="link" href="/admin" disabled text="disabled link" />
        </div>
      </div>

      <SectionLabel>Icon — SVG + Unicode glyph atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        {ICON_SAMPLES.map((name) => (
          <span key={name} className="skeu-preview-icon-cell" title={name}>
            <Icon name={name} size={20} />
          </span>
        ))}
        <span className="skeu-preview-note">
          named SVGs render inline; others fall back to a Unicode glyph.
        </span>
      </div>

      <SectionLabel>Badge</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        {BADGE_SAMPLES.map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
        <Badge href="https://github.com/ianrios">linked badge</Badge>
      </div>

      <SectionLabel>Input</SectionLabel>
      <div className="skeu-preview-input-wrap">
        <Input placeholder="Text input (tab to see focus ring)" fullWidth />
      </div>

      <SectionLabel>ValueInput — compact token editor input</SectionLabel>
      <div className="skeu-preview-col-group">
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
      <div className="skeu-preview-col-group">
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

      <SectionLabel>Switch — neumorphic toggle atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <Switch
          checked={switchOn}
          onChange={setSwitchOn}
          label={switchOn ? 'On' : 'Off'}
        />
        <Switch checked onChange={() => undefined} label="Always on" />
        <Switch checked={false} onChange={() => undefined} label="Always off" />
        <Switch checked onChange={() => undefined} disabled label="Disabled" />
        <span className="skeu-preview-note">
          track = inset groove · thumb = convex pop · on = --color-accent
        </span>
      </div>

      <SectionLabel>ColorPicker — styled color input atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <ColorPicker value="#39ff14" onChange={() => undefined} title="Green" />
        <ColorPicker value="#4da6ff" onChange={() => undefined} title="Blue" />
        <ColorPicker value="#ff4444" onChange={() => undefined} title="Red" />
        <ColorPicker
          value="#ffdd00"
          onChange={() => undefined}
          title="Yellow"
        />
        <span className="skeu-preview-note">
          border = --border-color · radius = --radius-sm · hover/active = link
          tokens
        </span>
      </div>
    </>
  );
}
