import { forwardRef, type InputHTMLAttributes, useId } from 'react';

/**
 * Input Component
 *
 * Modern patterns demonstrated:
 * 1. useId hook for accessible labels (React 18+)
 * 2. forwardRef for form library compatibility
 * 3. Error state handling
 * 4. Composable with form libraries like React Hook Form
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, className = '', id: providedId, ...props },
  ref
) {
  // useId generates a unique ID for accessibility - React 18+ feature
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const inputClasses = [
    'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    props.disabled && 'bg-gray-100 cursor-not-allowed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={id}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

export { Input, type InputProps };
