import type React from 'react';

export function ColorPicker({
  value,
  onChange,
  title,
  style,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      type="color"
      value={value}
      onChange={onChange}
      title={title}
      className={['skeu-color-picker', className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    />
  );
}
