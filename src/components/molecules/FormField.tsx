import type React from 'react';
import { Input } from '../atoms/Input';

export function FormField({
  label,
  hint,
  inputProps = {},
}: {
  label?: string;
  hint?: string;
  inputProps?: React.ComponentPropsWithoutRef<'input'>;
}) {
  return (
    <div>
      {label && <label className="skeu-form-field__label">{label}</label>}
      <Input fullWidth {...inputProps} />
      {hint && <div className="skeu-form-field__hint">{hint}</div>}
    </div>
  );
}
