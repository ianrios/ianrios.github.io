import { Icon } from "./Icon";

export function IconButton({
  name,
  size = 16,
  variant = "outline",
  className,
  ...props
}) {
  const cls = [
    "skeu-btn",
    variant === "primary" ? "skeu-btn--primary" : "skeu-btn--outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      className={cls}
      aria-label={props["aria-label"] || name}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--btn-padding-y, 6px)",
        aspectRatio: "1 / 1",
        ...props.style,
      }}
      {...props}
    >
      <Icon name={name} size={size} />
    </button>
  );
}
