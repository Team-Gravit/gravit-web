import type { WeeklyLearningRecordResponse } from '@/shared/api/generated/model';
import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

import { getWeekdayStreaks } from '../model/weekly-streak';
import { WeekdayBadge } from './weekday-badge';

const WEEKDAY_COUNT = 7;

export interface WeeklyStreakProps {
  record: WeeklyLearningRecordResponse;
  /** 「오늘」 기준. 테스트에서 고정할 때 넘긴다. */
  today?: Date;
  className?: string;
}

export function WeeklyStreak({ record, today = new Date(), className }: WeeklyStreakProps) {
  return (
    <ul data-slot="weekly-streak" className={cn('flex gap-3 md:gap-2', className)}>
      {getWeekdayStreaks(record, today).map(({ label, status }) => (
        <li key={label}>
          <WeekdayBadge label={label} status={status} />
        </li>
      ))}
    </ul>
  );
}

/** 뱃지와 같은 크기의 자리 7개. 데이터가 오면 레이아웃이 밀리지 않는다. */
export function WeeklyStreakSkeleton({ className }: { className?: string }) {
  return (
    <ul
      data-slot="weekly-streak"
      className={cn('flex gap-3 md:gap-2', className)}
      aria-hidden="true"
    >
      {Array.from({ length: WEEKDAY_COUNT }, (_, index) => (
        <li key={index}>
          <Skeleton variant="block" className="size-8 md:size-10" />
        </li>
      ))}
    </ul>
  );
}
