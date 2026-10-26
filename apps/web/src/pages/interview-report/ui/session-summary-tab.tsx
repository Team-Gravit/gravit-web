import { CardRetryStatus } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { useInterviewSessionSummary } from '@/entities/interview';

import { QuestionScoreChart } from './question-score-chart';
import { ReportWeakTopicsCard } from './report-weak-topics-card';
import { TotalScoreCard } from './total-score-card';

export interface SessionSummaryTabProps {
  sessionId: number;
  layout: 'wide' | 'narrow';
  onQuestionSelect: (displayOrder: number) => void;
}

export function SessionSummaryTab({ sessionId, layout, onQuestionSelect }: SessionSummaryTabProps) {
  const { data: summary, isPending, isError, refetch } = useInterviewSessionSummary(sessionId);

  if (isPending) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3 md:gap-8">
        <Skeleton variant="block" className="h-47.5 rounded-8 md:h-100.75 md:rounded-12" />
        <Skeleton variant="block" className="h-60.5 rounded-8 md:h-112.75 md:rounded-12" />
      </div>
    );
  }
  if (isError) {
    return (
      <CardRetryStatus
        sectionName="세션 종합"
        onRetry={() => void refetch()}
        className="rounded-8 bg-white py-20 md:rounded-12"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-8">
      <TotalScoreCard summary={summary} layout={layout} />
      <QuestionScoreChart
        answers={summary.answers}
        layout={layout}
        onQuestionSelect={onQuestionSelect}
      />
      {/* 약점 분야가 없는 화면은 시안에 없어 카드를 숨긴다(FEAT-062 spec 「확인 필요」). */}
      {summary.weakTopics.length > 0 ? (
        <ReportWeakTopicsCard weakTopics={summary.weakTopics} layout={layout} />
      ) : null}
    </div>
  );
}
