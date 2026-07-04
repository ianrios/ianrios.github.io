import type React from 'react';

type InputProps = {
  fullWidth?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'className' | 'style'>;

export function Input({ fullWidth, ...props }: InputProps) {
  const cls = ['skeu-input', fullWidth ? 'skeu-input--full' : '']
    .filter(Boolean)
    .join(' ');
  return <input className={cls} {...props} />;
}
