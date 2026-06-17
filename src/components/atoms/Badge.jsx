export function Badge({ children, style, href, ...props }) {
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
