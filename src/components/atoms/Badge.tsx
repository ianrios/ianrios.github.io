import type React from 'react';
import type { DesignSystemProps } from '../../types/design-system';

type BadgeProps = {
  href?: string;
  size?: 'xs';
  children?: React.ReactNode;
} & DesignSystemProps;

export function Badge({ children, size, href, ...props }: BadgeProps) {
  const cls = ['skeu-badge', size === 'xs' ? 'skeu-badge--xs' : '']
    .filter(Boolean)
    .join(' ');
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <span className={cls} {...props}>
      {children}
    </span>
  );
}
