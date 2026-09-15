import { CardRetryStatus } from '@/shared/ui/card';
import { UnitCard, UnitCardSkeleton, useRecentLearning } from '@/entities/learning';

export interface RecentUnitCardProps {
  className?: string;
}

/**
 * `ContinueLearningCard`와 쿼리를 공유한다.
 * 최근 챕터에 유닛이 없으면 아무것도 렌더링하지 않는다.
 */
export function RecentUnitCard({ className }: RecentUnitCardProps) {
  const { data: learning, isPending, isError, refetch } = useRecentLearning();

  if (isPending) {
    return <UnitCardSkeleton className={className} />;
  }

  if (isError) {
    return (
      <CardRetryStatus
        sectionName="최근 학습"
        onRetry={() => void refetch()}
        className={className}
      />
    );
  }

  const firstUnit = learning?.units[0];
  if (!learning || !firstUnit) {
    return null;
  }

  return (
    <UnitCard
      eyebrow="새 주제 시작하기"
      title={firstUnit.title}
      unitId={firstUnit.unitId}
      chapterId={learning.chapterId}
      className={className}
    />
  );
}
