import type React from 'react';

type ValueInputProps = {
  label?: string;
  suffix?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'className'>;

export function ValueInput({
  label,
  value,
  onChange,
  type = 'text',
  suffix,
  ...props
}: ValueInputProps) {
  return (
    <div className="skeu-value-input-wrap">
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
