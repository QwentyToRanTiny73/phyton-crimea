import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'new' | 'bestseller' | 'sale';
}

export function Badge({ label, variant = 'new' }: BadgeProps) {
  return (
    <span
      className={cn(
        'absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full z-10',
        {
          'bg-brand-green text-white': variant === 'new',
          'bg-brand-gold text-white': variant === 'bestseller',
          'bg-red-500 text-white': variant === 'sale',
        }
      )}
    >
      {label}
    </span>
  );
}
