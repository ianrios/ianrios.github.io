import type React from 'react';

type SectionPadding = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type SectionProps = {
  padding?: SectionPadding;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'>;

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
