import type React from 'react';

const SIZE_CLASS: Record<'xs' | 'sm' | 'lg' | 'xl', string> = {
  xs: 'skeu-btn--xs',
  sm: 'skeu-btn--sm',
  lg: 'skeu-btn--lg',
  xl: 'skeu-btn--xl',
};

type ButtonProps = {
  variant?: 'gradient' | 'primary' | 'outline';
  size?: 'xs' | 'sm' | 'lg' | 'xl';
} & React.ComponentPropsWithoutRef<'button'>;

export function Button({
  variant = 'outline',
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = ['skeu-btn'];
  if (variant === 'primary') cls.push('skeu-btn--primary');
  else if (variant === 'outline') cls.push('skeu-btn--outline');
  if (size) cls.push(SIZE_CLASS[size]);
  if (className) cls.push(className);
  return (
    <button className={cls.join(' ')} {...props}>
      {children}
    </button>
  );
}
