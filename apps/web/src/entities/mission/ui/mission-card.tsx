import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { LabeledProgressBar } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';

import type { DailyMission } from '../model/mission';

export interface MissionCardBodyProps {
  mission: DailyMission;
  /**
   * wide — 하단 「도전하러 가기」 CTA. 완료면 비활성 「미션 완료」.
   * narrow — CTA 없이 카드 전체가 링크. 완료면 링크 없음.
   */
  layout: 'wide' | 'narrow';
  className?: string;
}

/**
 * 카드 셸·헤더·조회 상태를 제외한 오늘의 미션 본문을 표시한다.
 *
 * narrow의 전체 링크가 본문을 덮을 수 있도록 부모 카드가 `relative`여야 한다.
 */
export function MissionCardBody({ mission, layout, className }: MissionCardBodyProps) {
  const { description, awardXp, progressPercent, isCompleted, route } = mission;
  const linkLabel = `${description} 도전하러 가기`;

  return (
    <div data-slot="mission-card-body" className={cn('flex flex-1 flex-col gap-4', className)}>
      {layout === 'narrow' && !isCompleted ? (
        <Link
          to={route}
          aria-label={linkLabel}
          className="absolute inset-0 z-10 rounded-8 outline-none focus-visible:ring-3 focus-visible:ring-purple-200 md:rounded-12"
        />
      ) : null}

      <div className="flex flex-col gap-1 md:gap-0">
        <h3 className="line-clamp-2 text-headline2 text-text-2 md:text-title3 md:text-text-1">
          {description}
        </h3>
        <span className="text-caption1 text-main md:text-body1-normal">완료 시 +{awardXp} XP</span>
      </div>

      <LabeledProgressBar
        label="진행률"
        value={progressPercent}
        className="mt-auto"
        labelClassName="text-label2 text-text-4 md:text-body1-normal md:text-text-4"
        valueClassName="text-label2 md:text-body1-normal"
      />

      {layout === 'wide' ? <MissionCta route={route} isCompleted={isCompleted} /> : null}
    </div>
  );
}

function MissionCta({ route, isCompleted }: Pick<DailyMission, 'route' | 'isCompleted'>) {
  // 링크는 네이티브 disabled를 지원하지 않으므로 완료 상태는 실제 button으로 렌더링한다.
  if (isCompleted) {
    return (
      <Button size="cta" disabled>
        미션 완료
      </Button>
    );
  }

  return (
    <Button size="cta" asChild>
      <Link to={route}>도전하러 가기</Link>
    </Button>
  );
}

export interface MissionCardBodySkeletonProps {
  layout: 'wide' | 'narrow';
  className?: string;
}

export function MissionCardBodySkeleton({ layout, className }: MissionCardBodySkeletonProps) {
  return (
    <div
      data-slot="mission-card-body"
      aria-busy="true"
      className={cn('flex flex-1 flex-col gap-4', className)}
    >
      <div className="flex flex-col gap-1">
        <Skeleton className="w-4/5 text-headline2" />
        <Skeleton className="w-22 text-caption1" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 text-body1-normal" />
          <Skeleton className="w-7 text-body1-normal" />
        </div>
        <Skeleton variant="block" className="h-2 w-full rounded-full" />
      </div>
      {layout === 'wide' ? <Skeleton variant="block" className="h-12 w-full md:h-[54px]" /> : null}
    </div>
  );
}
