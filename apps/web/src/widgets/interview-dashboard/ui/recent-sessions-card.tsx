import { cn } from '@/shared/lib/cn';
import { CardLink } from '@/shared/ui/card';
import { INTERVIEW_HISTORY_EMPTY_MESSAGE } from '@/entities/interview';

import { DashboardSectionCard } from './dashboard-section-card';
import { RecentSessionItem } from './recent-session-item';

export interface RecentSessionsCardProps {
  className?: string;
}

export function RecentSessionsCard({ className }: RecentSessionsCardProps) {
  return (
    <DashboardSectionCard
      title="최근 응시 이력"
      isEmpty={(dashboard) => dashboard.recentSessions.length === 0}
      emptyMessage={INTERVIEW_HISTORY_EMPTY_MESSAGE}
      renderContent={(dashboard) => (
        <ol className="flex flex-col gap-3">
          {dashboard.recentSessions.map((session) => (
            <RecentSessionItem key={session.sessionId} session={session} />
          ))}
        </ol>
      )}
      headerAction={
        <CardLink to="/interview/history" search={{ page: 1, sort: 'LATEST' }}>
          전체 보기
        </CardLink>
      }
      className={cn('min-h-66.25 md:min-h-87.5', className)}
    />
  );
}
