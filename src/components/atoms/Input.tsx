import type React from 'react';

export function Input({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={['skeu-input', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
