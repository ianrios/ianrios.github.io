export function PageLayout({ children, style }) {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        padding: "var(--space-lg)",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
