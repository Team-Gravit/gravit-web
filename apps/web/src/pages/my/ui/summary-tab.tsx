import { useMyPageSummary } from '@/entities/learning';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { StudyHeatmap } from '@/widgets/study-heatmap';

import { SUMMARY_CARD_CLASS, SummaryCard } from './summary-card';

/**
 * 마이페이지 요약 탭. 학습 통계 카드와 학습 기록 히트맵을 배치한다.
 * 통계(summary)와 기록(history)은 서로 다른 엔드포인트라 각 컴포넌트가 독립적으로 조회한다.
 * 둘을 함께 마운트해 요청이 병렬로 나가며, 각자 로딩·에러를 처리해 한쪽이 실패해도 다른 쪽은 보인다.
 */
export function SummaryTab() {
  return (
    <section aria-label="요약" className="flex flex-col gap-3 md:gap-6">
      <SummaryStatCard />
      <StudyHeatmap />
    </section>
  );
}

/** 학습 요약(summary) 조회 결과를 통계 카드로 표시한다. 카드 셸은 항상 유지한다. */
function SummaryStatCard() {
  const { data, isPending, isError, refetch } = useMyPageSummary();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  if (isError) {
    return (
      <Card className={SUMMARY_CARD_CLASS}>
        <CardRetryStatus
          className="py-8"
          sectionName="학습 요약"
          onRetry={() => refetch({ throwOnError: true })}
        />
      </Card>
    );
  }

  return <SummaryCard learningSummary={data} isLoading={showSkeleton} />;
}
