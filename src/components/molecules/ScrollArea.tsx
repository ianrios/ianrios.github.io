import type React from 'react';
import type { DesignSystemProps } from '../../types/design-system';

type ScrollAreaProps = {
  hideScrollbars?: boolean;
  height?: string;
  flex?: string;
  className?: string;
  children?: React.ReactNode;
} & DesignSystemProps<HTMLDivElement>;

export function ScrollArea({
  hideScrollbars = false,
  height,
  flex,
  className,
  children,
  ...props
}: ScrollAreaProps) {
  const cls = ['home-content__scroll'];
  if (hideScrollbars) cls.push('hide-scrollbars');
  if (className) cls.push(className);

  const style: React.CSSProperties = {};
  if (height) style.height = height;
  if (flex) style.flex = flex;

  return (
    <div className={cls.join(' ')} style={style} {...props}>
      {children}
    </div>
  );
}
