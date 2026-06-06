import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

const chipVariants = cva('inline-flex items-center rounded-full font-medium', {
  variants: {
    variant: {
      filled: 'bg-main text-text-1-w',
      outlined: 'bg-white border border-main text-main',
      muted: 'bg-white border border-bg-4 text-text-4',
    },
    size: {
      sm: 'px-2 h-[22px] text-caption1 md:h-8 md:px-4 md:text-body1-normal',
      md: 'px-4 h-[29px] text-body1-normal',
      lg: 'px-3 md:px-5 h-[26px] md:h-8 text-label2 md:text-headline1',
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'md',
  },
});

interface ChipProps extends VariantProps<typeof chipVariants> {
  children: React.ReactNode;
  className?: string;
}

export default function Chip({ variant, size, children, className }: ChipProps) {
  return <span className={cn(chipVariants({ variant, size }), className)}>{children}</span>;
}
