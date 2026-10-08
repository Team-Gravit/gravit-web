import UnitCard from '@/features/learning/ui/unit-card';
import { useGetLearning } from '@/shared/api/@generated/mainpage-api/mainpage-api';

import { toLearningViewModel } from './model';
import MainSectionError from './ui/main-section-error';

/**
 * 최근 학습 유닛 섹션(모바일). 최근 학습 챕터의 첫 유닛 카드를 보여줍니다.
 * - 로딩: 카드 형태를 유지한 채 데이터 영역만 스켈레톤(카드에 위임)
 * - 에러: 카드 전체를 재시도 UI로 대체
 */
export default function RecentUnitSection({ className }: { className?: string }) {
  const learning = useGetLearning();

  if (learning.isError) {
    return (
      <MainSectionError
        className={className}
        label="최근 학습"
        onRetry={() => void learning.refetch()}
      />
    );
  }

  if (learning.isPending) {
    return <UnitCard className={className} isLoading />;
  }

  if (!learning.data) return null;

  const { chapterId, items } = toLearningViewModel(learning.data);
  const firstUnit = items[0];
  if (!firstUnit) return null;

  return (
    <UnitCard
      className={className}
      title={firstUnit.title}
      unitId={firstUnit.unitId}
      chapterId={chapterId}
    />
  );
}
