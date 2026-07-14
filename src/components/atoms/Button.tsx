import type React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import type { DesignSystemProps } from '../../types/design-system';

// The unified clickable atom: one polymorphic control spanning button + link,
// with orthogonal variant / color / size / icon axes mapped to the .skeu-btn
// class family.

type Variant = 'solid' | 'outline' | 'surface' | 'ghost' | 'chisel';
type Color = 'default' | 'muted' | 'accent' | 'primary';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const VARIANT: Record<Variant, string> = {
  solid: 'skeu-btn--solid',
  outline: 'skeu-btn--outline',
  surface: 'skeu-btn--surface',
  ghost: 'skeu-btn--ghost',
  chisel: 'skeu-btn--chisel',
};

const COLOR: Record<Color, string> = {
  default: 'skeu-btn--color-default',
  muted: 'skeu-btn--color-muted',
  accent: 'skeu-btn--color-accent',
  primary: 'skeu-btn--color-primary',
};

const SIZE: Record<Size, string> = {
  xs: 'skeu-btn--size-xs',
  sm: 'skeu-btn--size-sm',
  md: 'skeu-btn--size-md',
  lg: 'skeu-btn--size-lg',
  xl: 'skeu-btn--size-xl',
};

// size drives the Icon glyph px alongside the padding class.
const ICON_PX: Record<Size, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

// Shared styling + a11y / handler props allowed on every arm.
interface StyleProps extends DesignSystemProps {
  variant?: Variant;
  color?: Color;
  size?: Size;
  underline?: boolean;
  fullWidth?: boolean;
  justify?: 'start' | 'center' | 'between';
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// Content arm: icon-only REQUIRES aria-label; labelled needs text|children.
interface IconOnlyContent {
  icon: IconName;
  text?: never;
  children?: never;
  'aria-label': string;
}
type LabelledContent =
  | { icon?: IconName; text: string; children?: React.ReactNode }
  | { icon?: IconName; text?: string; children: React.ReactNode };
type ContentProps = IconOnlyContent | LabelledContent;

// Element arm: discriminated on `as`.
interface ButtonArm {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
interface LinkArm {
  as: 'link';
  href: string;
  external?: boolean;
  routerState?: unknown;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

type ButtonProps =
  | (StyleProps & ContentProps & ButtonArm)
  | (StyleProps & ContentProps & LinkArm);

// Forward arbitrary aria-* without leaking styling / DOM-invalid props.
function ariaOf(props: ButtonProps): React.AriaAttributes {
  const src = props as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(src)) {
    if (key.startsWith('aria-')) out[key] = src[key];
  }
  return out;
}

function classesOf(
  variant: Variant,
  color: Color,
  size: Size,
  opts: {
    iconOnly: boolean;
    underline: boolean;
    fullWidth: boolean;
    justify: 'start' | 'center' | 'between' | undefined;
  },
): string {
  const cls = ['skeu-btn', VARIANT[variant], COLOR[color], SIZE[size]];
  if (opts.iconOnly) cls.push('skeu-btn--icon');
  if (opts.underline) cls.push('skeu-btn--underline');
  if (opts.fullWidth) cls.push('skeu-btn--full');
  if (opts.fullWidth && opts.justify === 'center')
    cls.push('skeu-btn--justify-center');
  else if (opts.fullWidth && opts.justify === 'between')
    cls.push('skeu-btn--justify-between');
  return cls.join(' ');
}

export function Button(props: ButtonProps) {
  const {
    variant = 'outline',
    color = 'default',
    size = 'md',
    underline = false,
    fullWidth = false,
    justify,
    icon,
    text,
    children,
    onClick,
  } = props;

  const iconOnly = Boolean(icon) && !text && children == null;
  const className = classesOf(variant, color, size, {
    iconOnly,
    underline,
    fullWidth,
    justify,
  });
  const aria = ariaOf(props);
  const body = (
    <>
      {icon ? <Icon name={icon} size={ICON_PX[size]} /> : null}
      {text}
      {children}
    </>
  );

  if (props.as === 'link') {
    const { href, external, routerState, target, rel, disabled } = props;
    if (disabled) {
      // Inert: not focusable/activatable, aria-disabled + pointer-events:none.
      return (
        <span
          className={`${className} skeu-btn--disabled`}
          aria-disabled="true"
          {...aria}
        >
          {body}
        </span>
      );
    }
    if (!external && href.startsWith('/')) {
      const state = routerState !== undefined ? { state: routerState } : {};
      // RouteTransitions intercepts every internal click at the capture
      // phase and navigates itself (for the view-transition pan), which
      // means <Link>'s own `state` prop never actually reaches `navigate` -
      // it needs a DOM-visible copy of the intended view to read instead.
      const navView =
        typeof routerState === 'object' &&
        routerState !== null &&
        'view' in routerState
          ? (routerState as { view?: string }).view
          : undefined;
      return (
        <RouterLink
          to={href}
          className={className}
          onClick={onClick}
          data-nav-view={navView}
          {...state}
          {...aria}
        >
          {body}
        </RouterLink>
      );
    }
    const http = Boolean(external) || href.startsWith('http');
    return (
      <a
        href={href}
        className={className}
        target={target ?? (http ? '_blank' : undefined)}
        rel={rel ?? (http ? 'noreferrer' : undefined)}
        onClick={onClick}
        {...aria}
      >
        {body}
      </a>
    );
  }

  const disabledCls = props.disabled
    ? `${className} skeu-btn--disabled`
    : className;
  return (
    <button
      className={disabledCls}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={onClick}
      {...aria}
    >
      {body}
    </button>
  );
}
