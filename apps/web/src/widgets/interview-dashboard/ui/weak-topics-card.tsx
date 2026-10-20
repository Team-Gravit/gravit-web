import { cn } from '@/shared/lib/cn';

import { DashboardSectionCard } from './dashboard-section-card';
import { WeakTopicItem } from './weak-topic-item';

export interface WeakTopicsCardProps {
  className?: string;
}

export function WeakTopicsCard({ className }: WeakTopicsCardProps) {
  return (
    <DashboardSectionCard
      title="가장 약한 분야"
      isEmpty={(dashboard) => dashboard.weakestTopics.length === 0}
      emptyMessage={'세션이 쌓이면\n약점 분야를 알려드려요.'}
      renderContent={(dashboard) => (
        <ul className="flex flex-col gap-2 md:gap-3">
          {dashboard.weakestTopics.map((topicAccuracy) => (
            <WeakTopicItem key={topicAccuracy.topic.topic} topicAccuracy={topicAccuracy} />
          ))}
        </ul>
      )}
      className={cn('min-h-68.75 md:min-h-87.5', className)}
    />
  );
}
