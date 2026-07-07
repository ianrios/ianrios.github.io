import { useId } from 'react';
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
  const generatedId = useId();
  const id = inputProps.id ?? generatedId;
  return (
    <div>
      {label && (
        <label className="skeu-form-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <Input fullWidth {...inputProps} id={id} />
      {hint && <div className="skeu-form-field__hint">{hint}</div>}
    </div>
  );
}
