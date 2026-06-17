import { Input } from "../atoms/Input";

export function FormField({ label, hint, inputProps = {} }) {
  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "var(--space-xxs)",
          }}
        >
          {label}
        </label>
      )}
      <Input style={{ width: "100%" }} {...inputProps} />
      {hint && (
        <div
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
            marginTop: "var(--space-xxs)",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
