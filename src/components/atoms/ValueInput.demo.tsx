import { useState } from 'react';
import { ValueInput } from './ValueInput';

export function ValueInputDemo() {
  const [inputVal, setInputVal] = useState('#39ff14');

  return (
    <>
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
    </>
  );
}
