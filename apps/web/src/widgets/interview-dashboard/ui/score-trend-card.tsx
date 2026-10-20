import { cn } from '@/shared/lib/cn';

import { DashboardSectionCard } from './dashboard-section-card';
import { ScoreTrendChart } from './score-trend-chart';

export interface ScoreTrendCardProps {
  className?: string;
}

export function ScoreTrendCard({ className }: ScoreTrendCardProps) {
  return (
    <DashboardSectionCard
      title="점수 추이"
      isEmpty={(dashboard) => dashboard.scoreTrends.length === 0}
      emptyMessage={'세션이 1개 이상 쌓이면\n추이를 볼 수 있어요.'}
      renderContent={(dashboard) => <ScoreTrendChart trends={dashboard.scoreTrends} />}
      headerAction={
        <span className="hidden text-body1-normal text-text-4 md:inline">
          클릭 시 상세 점수를 확인할 수 있어요
        </span>
      }
      className={cn('min-h-53 py-4 md:min-h-110.5', className)}
    />
  );
}
