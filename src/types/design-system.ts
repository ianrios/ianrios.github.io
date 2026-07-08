import type React from 'react';

/**
 * Base props for all design system components.
 * Blocks `style` prop to enforce design system purity.
 * Allows `className` for internal composition.
 *
 * @remarks
 * Design system components use named props only (no inline styles).
 * This ensures the library can be extracted without CSS/SCSS knowledge.
 *
 * Consumers must use named props (variant, size, color, etc.) instead
 * of inline styles. This pattern is enforced at compile time via
 * TypeScript and verified at runtime via drift checks.
 *
 * @example
 * ```typescript
 * import type { DesignSystemProps } from '../../types/design-system';
 *
 * type ButtonProps = DesignSystemProps<HTMLButtonElement> & {
 *   variant?: 'solid' | 'outline' | 'ghost';
 *   size?: 'xs' | 'sm' | 'md' | 'lg';
 * };
 *
 * export function Button({ variant, size, ...props }: ButtonProps) {
 *   return <button {...props} />;
 * }
 * ```
 */
export type DesignSystemProps<T extends HTMLElement = HTMLElement> = Omit<
  React.HTMLAttributes<T>,
  'style'
>;
