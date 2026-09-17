import { cn } from '@/shared/lib/cn';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { UnitListItem, UnitListItemSkeleton, useUnitsInChapter } from '@/entities/learning';

// 로딩 중 목록 높이 변화를 줄이기 위해 초기 행 수를 고정한다.
const SKELETON_ITEM_COUNT = 4;

const LIST_LAYOUT_CLASS = 'flex flex-col gap-3';

export interface UnitListProps {
  chapterId: number;
  className?: string;
}

export function UnitList({ chapterId, className }: UnitListProps) {
  const { data, isPending, isError, refetch } = useUnitsInChapter(chapterId);

  if (isPending) {
    return (
      <ol data-slot="unit-list" aria-busy="true" className={cn(LIST_LAYOUT_CLASS, className)}>
        {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
          <UnitListItemSkeleton key={index} />
        ))}
      </ol>
    );
  }

  if (isError) {
    return (
      <div data-slot="unit-list-status" className={cn('flex min-h-40', className)}>
        <CardRetryStatus sectionName="유닛 목록" onRetry={() => void refetch()} />
      </div>
    );
  }

  if (data.units.length === 0) {
    return (
      <div data-slot="unit-list-status" className={cn('flex min-h-40', className)}>
        <CardStatus message="유닛이 없습니다." />
      </div>
    );
  }

  return (
    <ol data-slot="unit-list" className={cn(LIST_LAYOUT_CLASS, className)}>
      {data.units.map((unit) => (
        <UnitListItem
          key={unit.unitId}
          unitId={unit.unitId}
          title={unit.title}
          description={unit.description}
          progressPercent={unit.progressPercent}
          order={unit.order}
        />
      ))}
    </ol>
  );
}
