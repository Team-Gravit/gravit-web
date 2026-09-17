import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';

import { formatUnitNumber } from '../model/unit-progress';

const CARD_CLASS =
  'rounded-8 border border-transparent bg-white px-4 py-3 md:rounded-12 md:px-8 md:py-7';

// 146px인 데스크톱 카드를 hover 시 약 151px로 확대한다.
const INTERACTIVE_CARD_CLASS =
  'relative transition-[transform,box-shadow,background-color] duration-200 ease-out hover:z-10 hover:shadow-[0_0_8px_var(--color-main-1)] hover:bg-purple-100 md:hover:scale-[1.034] motion-reduce:transition-none motion-reduce:md:hover:scale-100';

export interface UnitListItemProps {
  unitId: number;
  title: string;
  description: string;
  /** 0~100. 이미 보정된 값을 받는다. */
  progressPercent: number;
  /** 「Unit01」에 표시할 서버 지정 순번. */
  order: number;
  className?: string;
}

export function UnitListItem({
  unitId,
  title,
  description,
  progressPercent,
  order,
  className,
}: UnitListItemProps) {
  return (
    <li>
      <Link
        to="/learning/units/$unitId"
        params={{ unitId: String(unitId) }}
        className={cn(
          CARD_CLASS,
          INTERACTIVE_CARD_CLASS,
          'flex items-center justify-between outline-none focus-visible:ring-3 focus-visible:ring-purple-200 md:gap-8',
          className,
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 space-y-1 md:mb-4">
            <h2 className="break-keep text-headline2 text-text-2 md:text-heading2">
              {`Unit${formatUnitNumber(order)} - ${title}`}
            </h2>
            <p className="text-label2 text-text-4 md:text-label1">{description}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-11 shrink-0 text-headline2 text-text-4 md:text-heading2">
              {progressPercent}%
            </span>
            <ProgressBar
              value={progressPercent}
              aria-label={`${title} 진행률`}
              className="bg-bg-3"
            />
          </div>
        </div>

        {/* 좁은 화면은 제목 우측, 넓은 화면은 행 중앙에 맞춘다. */}
        <Icon name="chevron-right" className="absolute top-0 right-0 text-text-3 md:static" />
      </Link>
    </li>
  );
}

export function UnitListItemSkeleton({ className }: Pick<UnitListItemProps, 'className'>) {
  return (
    <li aria-busy="true" className={cn(CARD_CLASS, className)}>
      <div className="mb-1 space-y-1 md:mb-4">
        <Skeleton className="w-2/3 text-headline2 md:text-heading2" />
        <Skeleton className="w-1/2 text-label2 md:text-label1" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="w-11 shrink-0 text-headline2 md:text-heading2" />
        <Skeleton variant="block" className="h-2 w-full rounded-full" />
      </div>
    </li>
  );
}
