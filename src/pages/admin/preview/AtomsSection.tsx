import { HeadingDemo } from '../../../components/atoms/Heading.demo';
import { TextDemo } from '../../../components/atoms/Text.demo';
import { StackDemo } from '../../../components/atoms/Stack.demo';
import { SectionDemo } from '../../../components/atoms/Section.demo';
import {
  ButtonDemo,
  ButtonColorDemo,
} from '../../../components/atoms/Button.demo';
import { IconDemo } from '../../../components/atoms/Icon.demo';
import { BadgeDemo } from '../../../components/atoms/Badge.demo';
import { InputDemo } from '../../../components/atoms/Input.demo';
import { ValueInputDemo } from '../../../components/atoms/ValueInput.demo';
import { SliderDemo } from '../../../components/atoms/Slider.demo';
import { DialDemo } from '../../../components/atoms/Dial.demo';
import { SwitchDemo } from '../../../components/atoms/Switch.demo';
import { ColorPickerDemo } from '../../../components/atoms/ColorPicker.demo';
import { SelectDemo } from '../../../components/atoms/Select.demo';
import { SectionLabel, TierLabel } from '../AdminUI';

export function AtomsSection() {
  return (
    <>
      <TierLabel>Atoms</TierLabel>

      <SectionLabel>
        Heading/Text: 6 size tokens · --font-weight-heading vs
        --font-weight-base (compare weight) · Text `as` swaps the tag
      </SectionLabel>
      <div className="skeu-preview-section">
        <HeadingDemo />
        <TextDemo />
      </div>

      <SectionLabel>
        Stack/Section: flex + gap + layout props · padding
      </SectionLabel>
      <div className="skeu-preview-section">
        <StackDemo />
        <SectionDemo />
      </div>

      <SectionLabel>
        Button: variant × size · button / link / icon-only
      </SectionLabel>
      <div className="skeu-preview-section">
        <ButtonDemo />
      </div>

      <SectionLabel>Button: color axis (outline) · disabled</SectionLabel>
      <div className="skeu-preview-section">
        <ButtonColorDemo />
      </div>

      <SectionLabel>Icon: SVG + Unicode glyph atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <IconDemo />
      </div>

      <SectionLabel>Badge</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <BadgeDemo />
      </div>

      <SectionLabel>Input</SectionLabel>
      <div className="skeu-preview-input-wrap">
        <InputDemo />
      </div>

      <SectionLabel>ValueInput: compact token editor input</SectionLabel>
      <div className="skeu-preview-col-group">
        <ValueInputDemo />
      </div>

      <SectionLabel>Slider: custom range input atom</SectionLabel>
      <div className="skeu-preview-col-group">
        <SliderDemo />
      </div>

      <SectionLabel>Dial: rotary selector atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <DialDemo />
      </div>

      <SectionLabel>Switch: neumorphic toggle atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <SwitchDemo />
      </div>

      <SectionLabel>ColorPicker: styled color input atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <ColorPickerDemo />
      </div>

      <SectionLabel>Select: token-driven dropdown atom</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <SelectDemo />
      </div>
    </>
  );
}
