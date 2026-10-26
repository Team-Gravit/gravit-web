import type { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

export type StatusNumberStatus = 'current' | 'selected' | 'completed' | 'incomplete';

/** 번호 버튼과 범례가 항상 같은 상태 색을 쓰도록 공유한다. */
export const statusNumberColors = cva('border', {
  variants: {
    status: {
      current: 'border-transparent bg-cta text-cta-text',
      selected: 'border-transparent bg-main text-white',
      completed: 'border-purple-200 bg-purple-50 text-cta',
      incomplete: 'border-divider-2 bg-cta-disabled text-text-4',
    },
  },
  defaultVariants: { status: 'incomplete' },
});

export interface StatusNumberButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  status: StatusNumberStatus;
}

/** 상태색을 가진 번호(스텝) 버튼. 텍스트 크기 등은 className으로 조정한다. */
export function StatusNumberButton({
  status,
  className,
  children,
  ...props
}: StatusNumberButtonProps) {
  return (
    <button
      type="button"
      data-slot="status-number-button"
      data-status={status}
      aria-current={status === 'current' || status === 'selected' || undefined}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-8',
        'text-label2 cursor-pointer',
        'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        statusNumberColors({ status }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
