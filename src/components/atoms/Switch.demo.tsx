import { useState } from 'react';
import { Switch } from './Switch';

export function SwitchDemo() {
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <>
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
    </>
  );
}
