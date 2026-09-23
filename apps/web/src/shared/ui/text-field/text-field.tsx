import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

const textFieldVariants = cva(
  [
    'w-full rounded-8 px-4 py-[15px]',
    // 타이포
    'text-body2-reading',
    // 상호작용
    'border bg-white outline-none',
    'disabled:cursor-not-allowed read-only:cursor-default',
    'placeholder:text-text-4',
  ],
  {
    variants: {
      tone: {
        default: 'border-divider-1 text-text-1 focus-visible:border-main-1',
        success: 'border-semantic-success text-semantic-success',
        error: 'border-semantic-error text-semantic-error',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export interface TextFieldProps
  extends Omit<ComponentProps<'input'>, 'children' | 'type'>,
    VariantProps<typeof textFieldVariants> {}

export function TextField({ tone, className, ref, ...props }: TextFieldProps) {
  return (
    <input
      ref={ref}
      type="text"
      data-slot="text-field"
      data-tone={tone ?? 'default'}
      aria-invalid={tone === 'error' || undefined}
      className={cn(textFieldVariants({ tone }), className)}
      {...props}
    />
  );
}
