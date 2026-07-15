import { forwardRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, glow, children, disabled, onClick, type = 'button' }, ref) => {
    const variants = {
      primary: 'bg-navy-900 text-white hover:bg-navy-800 dark:bg-white dark:text-navy-900 dark:hover:bg-navy-100 shadow-lg shadow-navy-900/20 dark:shadow-none',
      secondary: 'bg-transparent text-navy-900 border-2 border-navy-900 hover:bg-navy-900 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-navy-900',
      accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25',
      ghost: 'bg-transparent text-navy-600 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-white',
      outline: 'bg-transparent text-navy-600 border border-navy-200 hover:border-navy-300 hover:bg-navy-50 dark:text-navy-300 dark:border-navy-700 dark:hover:border-navy-600 dark:hover:bg-navy-800',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-base rounded-xl gap-2',
      xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={[
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          glow ? 'hover:shadow-glow' : '',
          className || '',
        ].join(' ')}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
