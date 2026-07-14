import { useLayoutEffect, useRef, useState } from 'react';
import type React from 'react';
import type { DesignSystemProps } from '../../types/design-system';
import {
  mod,
  pointerAngle,
  angleDelta,
  computeDialLayout,
} from './dial-geometry';

type DialSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<DialSize, string> = {
  sm: 'skeu-dial-field--sm',
  md: 'skeu-dial-field--md',
  lg: 'skeu-dial-field--lg',
};

// Must match the --dial-label-radius each size class sets in _atoms.scss -
// the floor computeDialLayout's radius never shrinks past.
const BASE_LABEL_RADIUS: Record<DialSize, number> = { sm: 62, md: 80, lg: 98 };

// Keyboard nudge, in the same continuous units as `value` (Right/Up = +STEP,
// matching clockwise = increasing, since labels run clockwise from 12).
const KEY_STEP = 0.05;

type DialProps = {
  /** Arranged evenly clockwise around the dial, starting at 12 o'clock. */
  labels: string[];
  /**
   * Continuous rotation in [0, labels.length): integers point exactly at a
   * label, fractions sit between two adjacent labels. Value 0 and
   * labels.length are the same physical angle (seamless wrap). Not clamped
   * by the dial itself - a drag can carry it outside that range; wrap it at
   * the call site the same way you'd wrap any other continuous angle.
   */
  value: number;
  onChange: (value: number) => void;
  size?: DialSize;
  /**
   * When true, the dial reports only whole positions (each turn lands
   * exactly on a label, like a detent) instead of the continuous blend
   * value in between. `onChange` always receives an integer.
   */
  snap?: boolean;
  /**
   * Caps the dial's own footprint (in px). If the label set would
   * otherwise need more room than this to guarantee no overlap, labels
   * shrink just enough to fit instead - the container's real available
   * width always wins, never a container that grows to match the dial.
   */
  maxFieldSize?: number;
} & Omit<
  DesignSystemProps<HTMLDivElement>,
  | 'className'
  | 'children'
  | 'role'
  | 'tabIndex'
  | 'onChange'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onKeyDown'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
>;

// Generic rotary selector: a bevel knob with labels arranged radially
// around it and a pointer marking the current angle. Not theme-specific -
// FunPanel happens to use it to blend design-system presets, the same way
// it uses the generic Slider atom for its other master dials.
export function Dial({
  labels,
  value,
  onChange,
  size = 'md',
  snap = false,
  maxFieldSize,
  ...props
}: DialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ lastAngle: number; value: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const count = labels.length;

  // Self-sizes so labels can never overlap, no matter the label count or
  // text length: measures the widest rendered label, then grows the radius
  // (and the field that contains it) via computeDialLayout - never smaller
  // than the size preset's own radius, and never larger than maxFieldSize
  // (shrinking the label font instead, if given). Runs before paint, so
  // there's no visible jump from the preset size to the corrected one.
  const [layout, setLayout] = useState(() =>
    computeDialLayout(labels.length, 0, BASE_LABEL_RADIUS[size], maxFieldSize),
  );
  useLayoutEffect(() => {
    const maxLabelWidth = Math.max(
      0,
      ...labelRefs.current.slice(0, count).map((el) => el?.offsetWidth ?? 0),
    );
    setLayout(
      computeDialLayout(
        count,
        maxLabelWidth,
        BASE_LABEL_RADIUS[size],
        maxFieldSize,
      ),
    );
  }, [labels, count, size, maxFieldSize]);
  const { radius: labelRadius, fieldSize, fontScale } = layout;

  const dialCenter = (): { x: number; y: number } | null => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const center = dialCenter();
    if (!center) return;
    drag.current = {
      lastAngle: pointerAngle(center, { x: e.clientX, y: e.clientY }),
      value,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const center = dialCenter();
    if (!state || !center || count === 0) return;
    const angle = pointerAngle(center, { x: e.clientX, y: e.clientY });
    const delta = angleDelta(state.lastAngle, angle);
    const nextValue = state.value + (delta / 360) * count;
    state.lastAngle = angle;
    // Keep the internal accumulator continuous even in snap mode, so a
    // full rotation is still required to advance a step - only the
    // reported value rounds to a detent, the drag itself doesn't feel
    // jumpy or need extra travel to "catch up".
    state.value = nextValue;
    onChange(snap ? Math.round(nextValue) : nextValue);
  };

  const onPointerUp = () => {
    drag.current = null;
    setIsDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = snap ? 1 : KEY_STEP;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(snap ? Math.round(value) - step : value - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(snap ? Math.round(value) + step : value + step);
    }
  };

  const wrapped = count === 0 ? 0 : mod(value, count);
  const fromIndex = count === 0 ? 0 : Math.floor(wrapped);
  const toIndex = count === 0 ? 0 : mod(fromIndex + 1, count);
  const t = wrapped - fromIndex;
  const nearestIndex = count === 0 ? 0 : mod(Math.round(wrapped), count);
  const fromLabel = labels[fromIndex] ?? '';
  const toLabel = labels[toIndex] ?? '';
  const valueText =
    count === 0
      ? ''
      : t < 0.02
        ? fromLabel
        : t > 0.98
          ? toLabel
          : `${Math.round(t * 100)}% between ${fromLabel} and ${toLabel}`;

  return (
    <div
      className={['skeu-dial-field', SIZE_CLASS[size]].join(' ')}
      style={{ width: `${fieldSize}px`, height: `${fieldSize}px` }}
    >
      <div
        className="skeu-dial-labels"
        style={{
          '--dial-label-radius': `${labelRadius}px`,
          '--dial-label-font-scale': fontScale,
        }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            type="button"
            className={[
              'skeu-dial-label',
              i === nearestIndex ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--label-angle': `${(i * 360) / count}deg` }}
            aria-label={`Select ${label}`}
            onClick={() => {
              onChange(i);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        ref={dialRef}
        className={['skeu-dial', isDragging ? 'is-dragging' : '']
          .filter(Boolean)
          .join(' ')}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={wrapped}
        aria-valuetext={valueText}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        style={{
          '--dial-angle': `${count === 0 ? 0 : wrapped * (360 / count)}deg`,
        }}
        {...props}
      >
        <span className="skeu-dial__pointer" />
      </div>
    </div>
  );
}
