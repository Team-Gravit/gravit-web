import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { WeekdayStatus } from '../model/weekly-streak';

// 미완료와 예정은 의미가 다르지만 현재 같은 디자인을 사용한다.
const weekdayBadgeVariants = cva(
  'inline-flex size-8 items-center justify-center rounded-4 md:rounded-8 border text-label1 md:text-body1-normal md:size-10',
  {
    variants: {
      status: {
        completed: 'border-main bg-purple-50 text-cta',
        uncompleted: 'border-cta-disabled bg-white text-text-4',
        today: 'border-main bg-main text-text-1-w',
        upcoming: 'border-cta-disabled bg-white text-text-4',
      },
    },
  },
);

export interface WeekdayBadgeProps {
  label: string;
  status: WeekdayStatus;
  className?: string;
}

export function WeekdayBadge({ label, status, className }: WeekdayBadgeProps) {
  return (
    <span
      data-slot="weekday-badge"
      data-status={status}
      className={cn(weekdayBadgeVariants({ status }), className)}
    >
      {label}
    </span>
  );
}
