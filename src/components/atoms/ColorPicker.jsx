/**
 * ColorPicker atom — styled <input type="color"> whose chrome is fully token-driven.
 *   border-color  → --border-color (hover: --link-hover)
 *   border-radius → --radius-sm
 *   border-width  → 1px (thinner than focus ring, intentionally)
 */
export function ColorPicker({
  value,
  onChange,
  title,
  style,
  className,
  ...props
}) {
  return (
    <input
      type="color"
      value={value}
      onChange={onChange}
      title={title}
      className={["skeu-color-picker", className].filter(Boolean).join(" ")}
      style={style}
      {...props}
    />
  );
}
