import type React from 'react';
import type { DesignSystemProps } from '../../types/design-system';

const PADDING_CLASS: Record<'none' | 'xxs' | 'xs' | 'sm' | 'md', string> = {
  none: 'skeu-card--padding-none',
  xxs: 'skeu-card--padding-xxs',
  xs: 'skeu-card--padding-xs',
  sm: 'skeu-card--padding-sm',
  md: '',
};

interface CardProps extends DesignSystemProps<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: 'accent' | 'muted';
  padding?: 'none' | 'xxs' | 'xs' | 'sm' | 'md';
  maxWidth?: number;
}

export function Card({
  children,
  variant,
  padding = 'md',
  maxWidth,
}: CardProps) {
  const cls = ['skeu-card'];
  if (variant === 'accent') cls.push('skeu-card--accent');
  else if (variant === 'muted') cls.push('skeu-card--muted');
  const paddingCls = PADDING_CLASS[padding];
  if (paddingCls) cls.push(paddingCls);
  const inlineStyle =
    maxWidth !== undefined
      ? { '--card-max-width': `${maxWidth}px` }
      : undefined;
  return (
    <div className={cls.join(' ')} style={inlineStyle}>
      {children}
    </div>
  );
}
