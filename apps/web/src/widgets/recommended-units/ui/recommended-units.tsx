import type { ReactNode } from 'react';

import { Card, CardHeader, CardLink, CardRetryStatus, CardTitle } from '@/shared/ui/card';
import { UnitCard, UnitCardSkeleton, useRecommendedUnits } from '@/entities/learning';

const SKELETON_CARD_COUNT = 2;

export interface RecommendedUnitsProps {
  className?: string;
}

/** 추천 카드의 제목에는 시안에 따라 챕터명을 표시한다. */
export function RecommendedUnits({ className }: RecommendedUnitsProps) {
  const { data: units, isPending, isError, refetch } = useRecommendedUnits();

  let body: ReactNode;
  if (isPending) {
    body = (
      <div data-slot="recommended-units-grid" aria-busy="true" className="grid grid-cols-2 gap-4">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <UnitCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (isError) {
    body = <CardRetryStatus sectionName="추천 유닛" onRetry={() => void refetch()} />;
  } else {
    body = (
      <div data-slot="recommended-units-grid" className="grid grid-cols-2 gap-4">
        {units.map((unit) => (
          <UnitCard
            key={unit.unitId}
            title={unit.chapterTitle}
            unitId={unit.unitId}
            chapterId={unit.chapterId}
          />
        ))}
      </div>
    );
  }

  return (
    <Card data-section="recommended-units" className={className}>
      <CardHeader>
        <CardTitle>새 주제 시작하기</CardTitle>
        <CardLink to="/learning">전체보기</CardLink>
      </CardHeader>
      {body}
    </Card>
  );
}
