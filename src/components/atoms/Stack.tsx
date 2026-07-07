import type React from 'react';

type StackGap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type StackProps = {
  direction?: 'row' | 'col';
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export function Stack({
  direction = 'row',
  gap = 'sm',
  align,
  justify,
  className,
  children,
  ...props
}: StackProps) {
  const cls = [
    'skeu-stack',
    `skeu-stack--${direction}`,
    `skeu-stack--gap-${gap}`,
  ];
  if (align) cls.push(`skeu-stack--align-${align}`);
  if (justify) cls.push(`skeu-stack--justify-${justify}`);
  if (className) cls.push(className);
  return (
    <div className={cls.join(' ')} {...props}>
      {children}
    </div>
  );
}
