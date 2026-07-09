import { ColorPicker } from './ColorPicker';

export function ColorPickerDemo() {
  return (
    <>
      <ColorPicker value="#39ff14" onChange={() => undefined} title="Green" />
      <ColorPicker value="#4da6ff" onChange={() => undefined} title="Blue" />
      <ColorPicker value="#ff4444" onChange={() => undefined} title="Red" />
      <ColorPicker value="#ffdd00" onChange={() => undefined} title="Yellow" />
      <span className="skeu-preview-note">
        border = --border-color · radius = --radius-sm · hover/active = link
        tokens
      </span>
    </>
  );
}
