import type { DesignSystemProps } from '../../types/design-system';

interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  size?: 'sm' | 'md';
  className?: string;
} & Omit<DesignSystemProps<HTMLSelectElement>, 'onChange'>;

// Token-driven select styled to match the bevel design language, replacing
// raw <select> so theme/option pickers blend with the rest of the system.
export function Select({
  value,
  onValueChange,
  options,
  size = 'md',
  className,
  ...props
}: SelectProps) {
  const cls = ['skeu-select', `skeu-select--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <select
      className={cls}
      value={value}
      onChange={(e) => {
        onValueChange(e.target.value);
      }}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
