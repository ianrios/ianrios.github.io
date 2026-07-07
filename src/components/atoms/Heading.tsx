import type React from 'react';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const TAG: Record<Level, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

type HeadingProps = {
  level: Level;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className' | 'style'>;

export function Heading({
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = TAG[level];
  const cls = ['skeu-heading', `skeu-heading--h${level}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}
