import type { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';
import type { ProblemProgressStatus } from '@/features/lesson-quiz';

/** 번호 버튼과 범례가 항상 같은 상태 색을 사용하도록 공유한다. */
export const problemStatusColors = cva('border', {
  variants: {
    status: {
      current: 'border-transparent bg-cta text-cta-text',
      completed: 'border-purple-200 bg-purple-50 text-cta',
      incomplete: 'border-divider-2 bg-cta-disabled text-text-4',
    },
  },
  defaultVariants: { status: 'incomplete' },
});

export interface ProblemStatusButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  status: ProblemProgressStatus;
}

export function ProblemStatusButton({
  status,
  className,
  children,
  ...props
}: ProblemStatusButtonProps) {
  return (
    <button
      type="button"
      data-slot="problem-status-button"
      data-status={status}
      aria-current={status === 'current' || undefined}
      className={cn(
        // 레이아웃
        'flex size-10 shrink-0 items-center justify-center rounded-8',
        // 타이포·상호작용
        'text-label2 cursor-pointer',
        'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        problemStatusColors({ status }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
