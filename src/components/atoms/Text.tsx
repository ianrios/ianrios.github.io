import type React from 'react';

type TextTag = 'p' | 'span' | 'em' | 'strong';
type TextSize = 'xxs' | 'xs' | 'sm' | 'base' | 'lg';

type TextProps = {
  as?: TextTag;
  size?: TextSize;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'className'>;

export function Text({
  as = 'p',
  size = 'base',
  className,
  children,
  ...props
}: TextProps) {
  const Tag = as;
  const cls = ['skeu-text', `skeu-text--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}
