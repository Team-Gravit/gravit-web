import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

/**
 * 요약 탭 로딩 스켈레톤. `summary-card`·`study-heatmap`의 구조·높이를 그대로 미러링해
 * 로드 완료 시 레이아웃 시프트가 없게 한다. (구조를 바꾸면 이 파일도 함께 갱신한다.)
 */
export function SummaryTabSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-6">
      {/* 통계 카드: 모바일 = 왕관 블록 + 3지표, 데스크톱 = 4지표 한 줄 */}
      <Card className="w-full gap-0 rounded-12 border border-[#fbf1ff]/60 px-0 py-4 shadow-elevation-1 md:py-8">
        <div className="flex flex-col items-center gap-2 md:hidden">
          <Skeleton variant="circular" className="size-10" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton variant="text" className="w-20 text-title3" />
            <Skeleton variant="text" className="w-16 text-caption1" />
          </div>
        </div>

        <div className="flex w-full items-center px-4 py-3 md:px-0 md:py-0">
          <StatItemSkeleton className="hidden md:flex" />
          <StatItemSkeleton />
          <StatItemSkeleton />
          <StatItemSkeleton />
        </div>
      </Card>

      {/* 학습 기록 카드 */}
      <Card className="w-full gap-2 rounded-8 p-4 shadow-elevation-1 md:gap-4 md:rounded-12 md:px-8 md:py-7">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-20 text-label2 md:text-body1-normal" />
          <Skeleton variant="block" className="h-10 w-[150px] rounded-4" />
        </div>
        <div className="h-px w-full bg-divider-1" />
        <Skeleton variant="block" className="h-40 w-full rounded-8" />
        <div className="flex w-full items-center justify-end gap-2 md:gap-4">
          <Skeleton variant="text" className="w-24 text-caption1 md:text-heading2" />
        </div>
      </Card>
    </div>
  );
}

function StatItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-1 flex-col items-center gap-1 ${className ?? ''}`}>
      <Skeleton variant="text" className="w-14 text-headline2 md:text-title1" />
      <Skeleton variant="text" className="w-20 text-caption1 md:text-body1-normal" />
    </div>
  );
}
