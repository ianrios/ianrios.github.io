import type React from 'react';

type StackGap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type StackProps = {
  direction?: 'row' | 'col';
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  padding?: StackGap;
  height?: string;
  overflow?: 'hidden' | 'auto' | 'scroll';
  flex?: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export function Stack({
  direction = 'row',
  gap = 'sm',
  align,
  justify,
  padding,
  height,
  overflow,
  flex,
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
  if (padding) cls.push(`skeu-stack--padding-${padding}`);
  if (className) cls.push(className);

  const style: React.CSSProperties = {};
  if (height) style.height = height;
  if (overflow) style.overflow = overflow;
  if (flex) style.flex = flex;

  return (
    <div className={cls.join(' ')} style={style} {...props}>
      {children}
    </div>
  );
}
