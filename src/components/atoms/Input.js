export function Input({ className, ...props }) {
  return (
    <input
      className={["skeu-input", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
