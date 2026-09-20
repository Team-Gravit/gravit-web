import type { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import { OPTION_RESULTS, type OptionResult } from '../model/constants';

const optionMarkerVariants = cva(
  'flex size-6 md:size-8 shrink-0 items-center justify-center rounded-full border text-label2 md:text-body1-normal bg-white',
  {
    variants: {
      result: {
        correct: 'border-semantic-success text-semantic-success',
        incorrect: 'border-semantic-error text-semantic-error',
        neutral: 'border-text-3 text-text-3 ',
      },
    },
    defaultVariants: { result: OPTION_RESULTS.neutral },
  },
);

export interface OptionMarkerProps extends Omit<ComponentProps<'span'>, 'children'> {
  number: number;
  result?: OptionResult;
}

/**
 * 선지 앞에 붙는 번호 표식.
 */
export function OptionMarker({ number, result, className, ...props }: OptionMarkerProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="option-marker"
      className={cn(optionMarkerVariants({ result }), className)}
      {...props}
    >
      {number}
    </span>
  );
}
