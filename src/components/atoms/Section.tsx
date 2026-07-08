import type React from 'react';
import type { DesignSystemProps } from '../../types/design-system';

type SectionPadding = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type SectionProps = {
  padding?: SectionPadding;
  className?: string;
  children?: React.ReactNode;
} & DesignSystemProps;

export function Section({
  padding = 'md',
  className,
  children,
  ...props
}: SectionProps) {
  const cls = ['skeu-section', `skeu-section--padding-${padding}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={cls} {...props}>
      {children}
    </section>
  );
}
