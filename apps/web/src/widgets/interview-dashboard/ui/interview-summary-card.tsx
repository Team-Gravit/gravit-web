import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { StatItem } from '@/shared/ui/stat-item';
import { getRecentAverageScore, useInterviewDashboard } from '@/entities/interview';

import calendarIcon from './assets/calendar-icon.webp';
import scoreChartIcon from './assets/score-chart-icon.webp';

// 단위와 함께 "- 점"으로 표시한다.
const EMPTY_AVERAGE_SCORE = '- ';

export interface InterviewSummaryCardProps {
  layout: 'wide' | 'narrow';
  className?: string;
}

export function InterviewSummaryCard({ layout, className }: InterviewSummaryCardProps) {
  const { data: dashboard, isPending, isError, refetch } = useInterviewDashboard();
  const isWide = layout === 'wide';

  let body: ReactNode;
  if (isError) {
    body = <CardRetryStatus sectionName="면접 기록" onRetry={() => void refetch()} />;
  } else {
    const placeholder = <Skeleton className="w-6" />;
    const sessionCount = isPending ? placeholder : dashboard.completedSessionCount;
    const averageScore = isPending
      ? placeholder
      : (getRecentAverageScore(dashboard) ?? EMPTY_AVERAGE_SCORE);

    body = isWide ? (
      <dl className="flex flex-1 flex-col gap-7">
        <WideSummaryRow label="누적 세션" value={sessionCount} unit="회" icon={calendarIcon} />
        <hr className="border-divider-1" />
        <WideSummaryRow
          label="최근 5개 평균"
          value={averageScore}
          unit="점"
          icon={scoreChartIcon}
        />
      </dl>
    ) : (
      <div className="flex items-center">
        <StatItem value={<>{sessionCount}회</>} label="누적 세션" valueTone="muted" />
        <div aria-hidden className="h-10 w-px bg-divider-1" />
        <StatItem value={<>{averageScore}점</>} label="최근 5개 평균" valueTone="muted" />
      </div>
    );
  }

  return (
    <Card
      data-section="interview-summary"
      className={cn(isWide ? 'h-full gap-7 px-8 py-7' : 'p-4', className)}
    >
      {body}
    </Card>
  );
}

interface WideSummaryRowProps {
  label: string;
  value: ReactNode;
  unit: string;
  icon: string;
}

function WideSummaryRow({ label, value, unit, icon }: WideSummaryRowProps) {
  return (
    <div className="flex flex-1 items-end justify-between gap-2">
      <div className="flex flex-col gap-2 self-stretch">
        <dt className="text-body1-normal text-text-4">{label}</dt>
        <dd className="flex items-center gap-2 text-text-1">
          <span className="text-title1">{value}</span>
          <span className="text-title3">{unit}</span>
        </dd>
      </div>
      <img src={icon} alt="" className="w-20" />
    </div>
  );
}
