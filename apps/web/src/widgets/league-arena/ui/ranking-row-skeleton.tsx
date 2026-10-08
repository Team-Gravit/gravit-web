import { Skeleton } from '@/shared/ui/skeleton';

/** 랭킹 행 로딩 스켈레톤. UserRankRow와 같은 카드 형태를 흉내낸다. */
export function RankingRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-8 pr-4 shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] bg-[linear-gradient(150deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_100%)] md:h-21 md:gap-0 md:border-[1.482px] md:border-[rgba(255,193,252,0.1)] md:bg-none md:pr-0 md:shadow-none">
      <div className="flex min-w-0 flex-1 items-center gap-4 md:h-full md:gap-0 md:rounded-l-8 md:bg-white/20 md:backdrop-blur-[15px]">
        <div className="flex items-center justify-center self-stretch px-4 md:w-26.5 md:px-0">
          <Skeleton variant="block" animation="pulse" className="h-5 w-7 rounded-6" />
        </div>
        <div className="flex flex-1 items-center gap-3 py-3 md:py-0">
          <Skeleton variant="circular" animation="pulse" className="size-9 md:size-14" />
          <Skeleton variant="text" animation="pulse" className="w-24 md:w-40" />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 py-3 md:h-full md:justify-center md:gap-1.5 md:rounded-r-8 md:bg-[rgba(254,241,255,0.25)] md:px-6 md:backdrop-blur-[15px]">
        <Skeleton variant="text" animation="pulse" className="w-11 md:w-16" />
        <Skeleton variant="text" animation="pulse" className="w-11 md:w-16" />
      </div>
    </div>
  );
}
