import { CardRetryStatus } from '@/shared/ui/card';
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

  if (isError) {
    return (
      <CardRetryStatus
        sectionName="추천 유닛"
        onRetry={() => void refetch()}
        className={className}
      />
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
      className={className}
    />
  );
}
