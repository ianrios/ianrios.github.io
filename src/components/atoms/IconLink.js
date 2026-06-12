import { Icon } from "./Icon";

export function IconLink({ name, size = 16, href = "#", className, ...props }) {
  return (
    <a
      href={href}
      className={["skeu-link", className].filter(Boolean).join(" ")}
      aria-label={props["aria-label"] || name}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
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
    </a>
  );
}
