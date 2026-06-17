/**
 * Link atom — renders an <a> with the skeu-link variant system.
 *
 * variant: "surface" | "text" | "ghost"   (default: "surface")
 * color:   "default" | "muted" | "accent" | "primary"  (default: "default")
 * underline: boolean — forces underline on any variant (default: false; text variant always underlines)
 * size: "xs" | "sm" | "lg" | "xl" — applies skeu-btn size classes (surface variant only)
 */
export function Link({
  variant = "surface",
  color = "default",
  underline = false,
  size,
  className,
  href,
  children,
  external = false,
  ...props
}) {
  const cls = ["skeu-link"];

  if (variant === "text") cls.push("skeu-link--text");
  if (variant === "ghost") cls.push("skeu-link--ghost");

  if (color === "muted") cls.push("skeu-link--muted");
  if (color === "accent") cls.push("skeu-link--accent");
  if (color === "primary") cls.push("skeu-link--primary");

  if (underline) cls.push("skeu-link--underline");

  const SIZE_CLASS = {
    xs: "skeu-btn--xs",
    sm: "skeu-btn--sm",
    lg: "skeu-btn--lg",
    xl: "skeu-btn--xl",
  };
  if (size && SIZE_CLASS[size]) cls.push(SIZE_CLASS[size]);

  if (className) cls.push(className);

  return (
    <a
      href={href}
      className={cls.join(" ")}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
