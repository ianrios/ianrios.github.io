import { useState } from 'react';
import { Dial } from './Dial';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

export function DialDemo() {
  const [value, setValue] = useState(0);
  const [snapValue, setSnapValue] = useState(0);

  return (
    <>
      <Dial labels={DAYS} value={value} onChange={setValue} />
      <Dial labels={SEASONS} value={1.5} onChange={() => undefined} size="sm" />
      <Dial
        labels={SEASONS}
        value={snapValue}
        onChange={setSnapValue}
        snap
        size="sm"
      />
    </>
  );
}
