import { cn } from '@/shared/lib/cn';

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
      emptyMessage={'아직 응시한 세션이 없어요.\n첫 세션을 시작해볼까요?'}
      renderContent={(dashboard) => (
        <ol className="flex flex-col gap-3">
          {dashboard.recentSessions.map((session) => (
            <RecentSessionItem key={session.sessionId} session={session} />
          ))}
        </ol>
      )}
      className={cn('min-h-66.25 md:min-h-87.5', className)}
    />
  );
}
