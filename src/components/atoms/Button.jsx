const SIZE_CLASS = {
  xs: "skeu-btn--xs",
  sm: "skeu-btn--sm",
  lg: "skeu-btn--lg",
  xl: "skeu-btn--xl",
};

export function Button({
  variant = "outline",
  size,
  className,
  children,
  ...props
}) {
  const cls = ["skeu-btn"];
  if (variant === "primary") cls.push("skeu-btn--primary");
  else if (variant === "outline") cls.push("skeu-btn--outline");
  if (size && SIZE_CLASS[size]) cls.push(SIZE_CLASS[size]);
  if (className) cls.push(className);
  return (
    <button className={cls.join(" ")} {...props}>
      {children}
    </button>
  );
}
