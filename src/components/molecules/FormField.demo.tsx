import { FormField } from './FormField';

export function FormFieldDemo() {
  return (
    <FormField
      label="Email address"
      hint="We'll never share your email."
      inputProps={{
        id: 'demo-email',
        type: 'email',
        placeholder: 'you@example.com',
      }}
    />
  );
}
