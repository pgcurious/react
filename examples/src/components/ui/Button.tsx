import { forwardRef, type ButtonHTMLAttributes } from 'react';

/**
 * Button Component
 *
 * Modern patterns demonstrated:
 * 1. Direct function typing (no React.FC)
 * 2. Extends native HTML attributes
 * 3. forwardRef for ref forwarding (still needed in React 18)
 * 4. Variant patterns using discriminated types
 */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Use forwardRef when you need to expose the DOM element ref
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    className = '',
    ...props
  },
  ref
) {
  // Compose class names based on props
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    (disabled || isLoading) && disabledStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2">
          {/* Simple loading spinner */}
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}

      {children}

      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
