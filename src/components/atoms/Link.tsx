import type React from 'react';

const LINK_SIZE_CLASS: Record<'xs' | 'sm' | 'lg' | 'xl', string> = {
  xs: 'skeu-btn--xs',
  sm: 'skeu-btn--sm',
  lg: 'skeu-btn--lg',
  xl: 'skeu-btn--xl',
};

type LinkProps = {
  variant?: 'surface' | 'text' | 'ghost';
  color?: 'default' | 'muted' | 'accent' | 'primary';
  underline?: boolean;
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  external?: boolean;
} & React.ComponentPropsWithoutRef<'a'>;

export function Link({
  variant = 'surface',
  color = 'default',
  underline = false,
  size,
  className,
  href,
  children,
  external = false,
  ...props
}: LinkProps) {
  const cls = ['skeu-link'];

  if (variant === 'text') cls.push('skeu-link--text');
  if (variant === 'ghost') cls.push('skeu-link--ghost');

  if (color === 'muted') cls.push('skeu-link--muted');
  if (color === 'accent') cls.push('skeu-link--accent');
  if (color === 'primary') cls.push('skeu-link--primary');

  if (underline) cls.push('skeu-link--underline');

  if (size) cls.push(LINK_SIZE_CLASS[size]);

  if (className) cls.push(className);

  return (
    <a
      href={href}
      className={cls.join(' ')}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
