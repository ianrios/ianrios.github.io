import { useState } from 'react';
import { Select } from './Select';

export function SelectDemo() {
  const [value, setValue] = useState('react');
  return (
    <Select
      value={value}
      onValueChange={setValue}
      options={[
        { value: 'react', label: 'React' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'solid', label: 'Solid' },
      ]}
    />
  );
}
