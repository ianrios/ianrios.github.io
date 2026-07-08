type InputProps = {
  fullWidth?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'className'>;

export function Input({ fullWidth, ...props }: InputProps) {
  const cls = ['skeu-input', fullWidth ? 'skeu-input--full' : '']
    .filter(Boolean)
    .join(' ');
  return <input className={cls} {...props} />;
}
