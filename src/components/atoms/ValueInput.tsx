import type React from 'react';

type ValueInputProps = {
  label?: string;
  suffix?: string;
} & React.ComponentPropsWithoutRef<'input'>;

export function ValueInput({
  label,
  value,
  onChange,
  type = 'text',
  suffix,
  style,
  className,
  ...props
}: ValueInputProps) {
  return (
    <div
      className={['skeu-value-input-wrap', className].filter(Boolean).join(' ')}
      style={style}
    >
      {label && <span className="skeu-slider-label">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="skeu-value-input"
        {...props}
      />
      {suffix && <span className="skeu-slider-label">{suffix}</span>}
    </div>
  );
}
