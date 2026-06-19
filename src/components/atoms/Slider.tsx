import type React from 'react';

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  unit?: string;
  showValue?: boolean;
  style?: React.CSSProperties;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'min' | 'max' | 'step' | 'value' | 'onChange' | 'style' | 'className'
>;

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  unit,
  showValue,
  style,
  className,
  ...props
}: SliderProps) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const displayValue = showValue ?? unit !== undefined;

  return (
    <div
      className={['skeu-slider-wrap', className].filter(Boolean).join(' ')}
      style={style}
    >
      {label && <span className="skeu-slider-label">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="skeu-slider"
        style={{ '--slider-pct': `${pct}%` }}
        {...props}
      />
      {displayValue && (
        <span className="skeu-slider-value">
          {value}
          {unit ?? ''}
        </span>
      )}
    </div>
  );
}
