import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card, CardHeader, CardRetryStatus, CardTitle } from '@/shared/ui/card';
import { MissionCardBody, MissionCardBodySkeleton, useDailyMission } from '@/entities/mission';

export interface DailyMissionProps {
  /** `wide`는 CTA 버튼을, `narrow`는 카드 전체 링크를 사용한다. */
  layout: 'wide' | 'narrow';
  className?: string;
}

/** 조회에 실패해도 카드 헤더를 유지하고 본문에 재시도 UI를 표시한다. */
export function DailyMission({ layout, className }: DailyMissionProps) {
  const { data: mission, isPending, isError, refetch } = useDailyMission();

  let body: ReactNode;
  if (isPending) {
    body = <MissionCardBodySkeleton layout={layout} />;
  } else if (isError) {
    body = <CardRetryStatus sectionName="오늘의 미션" onRetry={() => void refetch()} />;
  } else {
    body = <MissionCardBody mission={mission} layout={layout} />;
  }

  // 좁은 화면의 전체 카드 링크가 이 카드를 기준으로 배치된다.
  return (
    <Card data-section="daily-mission" className={cn('relative', className)}>
      <CardHeader>
        <CardTitle>오늘의 미션</CardTitle>
      </CardHeader>
      {body}
    </Card>
  );
}
