/**
 * Slider atom — custom-styled range input that replaces the stock browser slider.
 *
 * Props:
 *   min, max, step — range constraints
 *   value          — controlled value
 *   onChange       — (e) => ... handler
 *   label          — optional left label
 *   unit           — optional suffix (e.g. "px", "s", "%") shown after value
 *   showValue      — show the current value on the right (default: true when unit is provided)
 */
export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  unit,
  showValue,
  style,
  className,
  ...props
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const displayValue = showValue !== undefined ? showValue : unit !== undefined;

  return (
    <div
      className={["skeu-slider-wrap", className].filter(Boolean).join(" ")}
      style={style}
    >
      {label && <span className="skeu-slider-label">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="skeu-slider"
        style={{ "--slider-pct": `${pct}%` }}
        {...props}
      />
      {displayValue && (
        <span className="skeu-slider-value">
          {value}
          {unit ?? ""}
        </span>
      )}
    </div>
  );
}
