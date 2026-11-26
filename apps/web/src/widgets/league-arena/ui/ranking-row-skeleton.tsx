import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

import { SKELETON_FILL } from '../model/constants';

/** 랭킹 행 로딩 스켈레톤. UserRankRow와 칸 구성·크기를 맞춘다. */
export function RankingRowSkeleton() {
  return (
    <div className="flex items-center rounded-8 shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] bg-[linear-gradient(150deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_100%)] md:h-21 md:border-[1.482px] md:border-[rgba(255,193,252,0.1)] md:bg-none md:shadow-none">
      <div className="flex min-w-0 flex-1 items-center gap-4 md:h-full md:gap-0 md:rounded-l-8 md:bg-white/20 md:backdrop-blur-[15px]">
        <div className="flex items-center justify-center self-stretch rounded-l-8 bg-purple-100/50 px-4 md:w-26.5 md:rounded-l-none md:bg-transparent md:px-0">
          <Skeleton
            variant="block"
            animation="pulse"
            className={cn('h-5 w-10 rounded-6 md:w-7', SKELETON_FILL)}
          />
        </div>
        <div className="my-3 flex min-w-0 flex-1 items-center gap-3 border-r border-text-2-w md:h-full md:border-0">
          <Skeleton
            variant="circular"
            animation="pulse"
            className={cn('size-9.5 shrink-0 md:size-14', SKELETON_FILL)}
          />
          <Skeleton
            variant="text"
            animation="pulse"
            className={cn('w-16 text-label1 md:h-8 md:w-40', SKELETON_FILL)}
          />
        </div>
      </div>
      <div className="flex min-w-20 shrink-0 flex-col items-start justify-center gap-1 px-4 md:h-full md:min-w-32 md:gap-1.5 md:rounded-r-8 md:bg-[rgba(254,241,255,0.25)] md:px-6 md:backdrop-blur-2xl">
        {['LP', 'LV'].map((label) => (
          <Skeleton
            key={label}
            variant="text"
            animation="pulse"
            className={cn('w-11 text-label1 md:w-16 md:text-heading1', SKELETON_FILL)}
          />
        ))}
      </div>
    </div>
  );
}
