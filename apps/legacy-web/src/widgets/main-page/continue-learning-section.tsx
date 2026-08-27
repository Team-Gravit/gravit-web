import { useGetLearning } from '@/shared/api/@generated/mainpage-api/mainpage-api';

import { toLearningViewModel } from './model';
import MainSectionError from './ui/main-section-error';
import UnitListCard from './unit-list-card';

/**
 * 이어서 학습하기 섹션. 최근 학습 챕터의 유닛 목록을 렌더링합니다.
 * - 로딩: 카드 껍데기(타이틀)는 유지하고 데이터 영역만 스켈레톤(카드에 위임)
 * - 에러: 카드 전체를 재시도 UI로 대체
 */
export default function ContinueLearningSection() {
  const learning = useGetLearning();

  if (learning.isError) {
    return <MainSectionError label="이어 학습하기" onRetry={() => void learning.refetch()} />;
  }

  if (learning.isPending) {
    return <UnitListCard isLoading />;
  }

  if (!learning.data) return null;

  const { chapterId, chapterTitle, chapterProgressRate, items } = toLearningViewModel(
    learning.data,
  );

  return (
    <UnitListCard
      chapterId={chapterId}
      chapterTitle={chapterTitle}
      chapterProgressRate={chapterProgressRate}
      units={items}
    />
  );
}
