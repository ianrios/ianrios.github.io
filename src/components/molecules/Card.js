export function Card({ children, className, style }) {
  return (
    <div
      className={["skeu-card", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
