import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card, CardHeader, CardRetryStatus, CardStatus, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { useInterviewDashboard, type InterviewDashboardResponse } from '@/entities/interview';

export interface DashboardSectionCardProps {
  title: string;
  isEmpty: (dashboard: InterviewDashboardResponse) => boolean;
  /** 줄바꿈(`\n`)은 그대로 표시한다. */
  emptyMessage: string;
  renderContent: (dashboard: InterviewDashboardResponse) => ReactNode;
  /** 데이터가 있을 때만 헤더 오른쪽에 둘 요소. */
  headerAction?: ReactNode;
  className?: string;
}

export function DashboardSectionCard({
  title,
  isEmpty,
  emptyMessage,
  renderContent,
  headerAction,
  className,
}: DashboardSectionCardProps) {
  const { data: dashboard, isPending, isError, refetch } = useInterviewDashboard();

  let body: ReactNode;
  let hasContent = false;
  if (isPending) {
    body = <Skeleton variant="block" aria-busy="true" className="flex-1 rounded-8" />;
  } else if (isError) {
    body = <CardRetryStatus sectionName={title} onRetry={() => void refetch()} />;
  } else if (isEmpty(dashboard)) {
    body = <CardStatus message={emptyMessage} className="whitespace-pre-line" />;
  } else {
    body = renderContent(dashboard);
    hasContent = true;
  }

  return (
    <Card className={cn('px-4 py-5 md:p-8', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {hasContent ? headerAction : null}
      </CardHeader>
      {body}
    </Card>
  );
}
