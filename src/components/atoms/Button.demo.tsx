import { Button } from './Button';
import { Stack } from './Stack';

const BUTTON_VARIANTS = [
  'solid',
  'outline',
  'surface',
  'chisel',
  'ghost',
] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
const BUTTON_COLORS = ['default', 'muted', 'accent', 'primary'] as const;

// variant x size grid, plus icon-only and link arms.
export function ButtonDemo() {
  return (
    <>
      {BUTTON_VARIANTS.map((variant) => (
        <Stack
          key={variant}
          direction="col"
          gap="xs"
          className="skeu-btn-size-group"
        >
          <span className="skeu-btn-size-sublabel">{variant}</span>
          <Stack
            direction="row"
            gap="sm"
            className="skeu-preview-flex skeu-preview-flex--end"
          >
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size} text={size} />
            ))}
            <Button
              variant={variant}
              icon="send"
              aria-label={`${variant} icon-only`}
            />
            <Button
              variant={variant}
              as="link"
              href="/design-system"
              text="link"
            />
          </Stack>
        </Stack>
      ))}
      <span className="skeu-preview-note">
        solid fill · outline bevel · surface smooth→border · chisel
        smooth→hard-bevel · ghost bare · <code>underline</code> optional.
      </span>
    </>
  );
}

// color axis (outline variant) plus underline / disabled states.
export function ButtonColorDemo() {
  return (
    <>
      <Stack direction="row" gap="sm" className="skeu-preview-flex">
        {BUTTON_COLORS.map((color) => (
          <Button key={color} variant="outline" color={color} text={color} />
        ))}
      </Stack>
      <Stack
        direction="row"
        gap="sm"
        className="skeu-preview-flex skeu-preview-flex--end skeu-mt-md"
      >
        <Button variant="ghost" underline text="underline" />
        <Button
          as="link"
          href="/design-system"
          underline
          text="link underline"
        />
        <Button variant="outline" disabled text="disabled" />
        <Button as="link" href="/design-system" disabled text="disabled link" />
      </Stack>
    </>
  );
}
