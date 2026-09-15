import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

import type { UnitProgress } from '../model/unit-progress';
import { UnitProgressItem } from './unit-progress-item';

const SKELETON_ROW_COUNT = 3;

export interface UnitProgressListProps {
  units: UnitProgress[];
  className?: string;
}

export function UnitProgressList({ units, className }: UnitProgressListProps) {
  return (
    // 카드 높이를 유지하기 위해 목록만 스크롤한다.
    <ul
      data-slot="unit-progress-list"
      className={cn(
        'flex max-h-37 flex-col gap-2 overflow-y-auto overscroll-contain md:max-h-46',
        className,
      )}
    >
      {units.map((unit) => (
        <UnitProgressItem key={unit.unitId} unit={unit} />
      ))}
    </ul>
  );
}

export function UnitProgressListSkeleton({ className }: { className?: string }) {
  return (
    <ul
      data-slot="unit-progress-list"
      aria-hidden="true"
      className={cn('flex flex-col gap-2', className)}
    >
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <li key={index}>
          <Skeleton variant="block" className="h-[42px] w-full rounded-4 md:h-14 md:rounded-8" />
        </li>
      ))}
    </ul>
  );
}
