import { Card, CardHeader, CardRetryStatus, CardTitle } from '@/shared/ui/card';
import { UnitCard, UnitCardSkeleton, useRecommendedUnits } from '@/entities/learning';

export interface RecommendedUnitCardProps {
  className?: string;
}

/** 좁은 화면에서는 RecommendedUnits와 같은 추천 목록의 첫 항목만 표시한다. */
export function RecommendedUnitCard({ className }: RecommendedUnitCardProps) {
  const { data: units, isPending, isError, refetch } = useRecommendedUnits();

  if (isPending) {
    return <UnitCardSkeleton className={className} />;
  }

  // 다른 메인 위젯처럼 카드 틀과 제목 안에 오류 안내를 둔다.
  if (isError) {
    return (
      <Card data-section="recommended-unit" className={className}>
        <CardHeader>
          <CardTitle>새 주제 시작하기</CardTitle>
        </CardHeader>
        <CardRetryStatus sectionName="추천 유닛" onRetry={() => void refetch()} />
      </Card>
    );
  }

  const firstUnit = units[0];
  if (!firstUnit) {
    return null;
  }

  return (
    <UnitCard
      eyebrow="새 주제 시작하기"
      title={firstUnit.chapterTitle}
      unitId={firstUnit.unitId}
      chapterId={firstUnit.chapterId}
      planetLoading="eager"
      className={className}
    />
  );
}
