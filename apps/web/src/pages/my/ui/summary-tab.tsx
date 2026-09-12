import { useMyPageSummary } from '@/entities/user';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { StudyHeatmap } from '@/widgets/study-heatmap';

import { SummaryCard } from './summary-card';
import { SummaryTabSkeleton } from './summary-tab-skeleton';

/**
 * 마이페이지 요약 탭. 학습 통계 카드와 학습 기록 히트맵을 배치한다.
 * 통계(summary)와 기록(history)은 서로 다른 엔드포인트라 카드/히트맵이 각자 조회한다.
 */
export function SummaryTab() {
  const { data: summary, isPending } = useMyPageSummary();
  const showSkeleton = useDelayedFlag(isPending);

  if (!summary) {
    return showSkeleton ? <SummaryTabSkeleton /> : null;
  }

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <SummaryCard learningSummary={summary} />
      <StudyHeatmap />
    </div>
  );
}
