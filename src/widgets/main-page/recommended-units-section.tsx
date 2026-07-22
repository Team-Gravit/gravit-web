import { useGetUnits } from '@/shared/api/@generated/mainpage-api/mainpage-api';

import { toRecommendedUnitsViewModel } from './model';
import RecommendedUnitsList from './recommended-units-list';
import MainSectionError from './ui/main-section-error';

/**
 * 추천 유닛 섹션. 추천 유닛 목록을 조회해 프레젠테이션 컴포넌트에 전달합니다.
 * - 로딩: 카드 껍데기(타이틀)는 유지하고 유닛 카드 영역만 스켈레톤(카드에 위임)
 * - 에러: 카드 전체를 재시도 UI로 대체
 */
export default function RecommendedUnitsSection() {
  const units = useGetUnits();

  if (units.isError) {
    return <MainSectionError label="추천 유닛" onRetry={() => void units.refetch()} />;
  }

  if (units.isPending) {
    return <RecommendedUnitsList isLoading />;
  }

  if (!units.data) return null;

  return <RecommendedUnitsList units={toRecommendedUnitsViewModel(units.data)} />;
}
