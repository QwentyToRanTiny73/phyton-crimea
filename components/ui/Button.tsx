import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // variants
          'bg-brand-green text-white hover:bg-brand-green-dark focus:ring-brand-green':
            variant === 'primary',
          'bg-brand-gold text-white hover:bg-brand-gold-light focus:ring-brand-gold':
            variant === 'secondary',
          'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white focus:ring-brand-green':
            variant === 'outline',
          'text-brand-green hover:bg-brand-beige focus:ring-brand-green':
            variant === 'ghost',
          // sizes
          'px-4 py-1.5 text-sm gap-1.5': size === 'sm',
          'px-6 py-2.5 text-base gap-2': size === 'md',
          'px-8 py-3.5 text-lg gap-2.5': size === 'lg',
          // full width
          'w-full': fullWidth,
        },
        className
      )}
    >
      {children}
    </button>
  );
}
