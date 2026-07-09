import { useState } from 'react';
import { Slider } from './Slider';

export function SliderDemo() {
  const [sliderVal, setSliderVal] = useState(40);

  return (
    <>
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
    </>
  );
}
