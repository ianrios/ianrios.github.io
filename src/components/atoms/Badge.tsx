import type React from 'react';

type BadgeProps = {
  href?: string | undefined;
  children?: React.ReactNode;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLElement>;

export function Badge({ children, style, href, ...props }: BadgeProps) {
  if (href) {
    return (
      <a
        href={href}
        className="skeu-badge"
        style={style}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <span className="skeu-badge" style={style} {...props}>
      {children}
    </span>
  );
}
