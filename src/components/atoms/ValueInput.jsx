/**
 * ValueInput atom — compact labeled input for editing token values (hex colors, px/em/s values).
 *
 * Props:
 *   label    — shown before the input
 *   value    — controlled value
 *   onChange — (e) => ... handler
 *   type     — input type (default: "text")
 *   suffix   — optional static suffix displayed after input (e.g. "px")
 */
export function ValueInput({
  label,
  value,
  onChange,
  type = "text",
  suffix,
  style,
  className,
  ...props
}) {
  return (
    <div
      className={["skeu-value-input-wrap", className].filter(Boolean).join(" ")}
      style={style}
    >
      {label && <span className="skeu-slider-label">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="skeu-value-input"
        {...props}
      />
      {suffix && <span className="skeu-slider-label">{suffix}</span>}
    </div>
  );
}
