import type React from 'react';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
} & Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'className' | 'style' | 'onChange' | 'children' | 'type' | 'role'
>;

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  ...props
}: SwitchProps) {
  const cls = ['skeu-switch', checked ? 'is-on' : ''].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cls}
      disabled={disabled}
      onClick={() => {
        onChange(!checked);
      }}
      {...props}
    >
      <span className="skeu-switch__track">
        <span className="skeu-switch__thumb" />
      </span>
      {label && <span className="skeu-switch__label">{label}</span>}
    </button>
  );
}
