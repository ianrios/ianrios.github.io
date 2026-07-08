import type React from 'react';

export function ColorPicker({
  value,
  onChange,
  title,
  ...props
}: Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'style' | 'type'
>) {
  return (
    <input
      type="color"
      value={value}
      onChange={onChange}
      title={title}
      className="skeu-color-picker"
      {...props}
    />
  );
}
