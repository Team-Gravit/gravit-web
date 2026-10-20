import { useState } from 'react';

import { cn } from '@/shared/lib/cn';

import { WEAK_TOPICS_EMPTY_MESSAGE, WEAK_TOPICS_TITLE } from '../model/weak-topics';
import { DashboardSectionCard } from './dashboard-section-card';
import { WeakTopicItem } from './weak-topic-item';
import { WeakTopicsModal } from './weak-topics-modal';

export interface WeakTopicsCardProps {
  className?: string;
}

export function WeakTopicsCard({ className }: WeakTopicsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DashboardSectionCard
        title={WEAK_TOPICS_TITLE}
        isEmpty={(dashboard) => dashboard.weakestTopics.length === 0}
        emptyMessage={WEAK_TOPICS_EMPTY_MESSAGE}
        renderContent={(dashboard) => (
          <ul className="flex flex-col gap-2 md:gap-3">
            {dashboard.weakestTopics.map((topicAccuracy) => (
              <WeakTopicItem key={topicAccuracy.topic.topic} topicAccuracy={topicAccuracy} />
            ))}
          </ul>
        )}
        headerAction={
          // CardLink는 이동용이다. 모달을 여는 동작에는 버튼을 쓴다.
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer text-label2 text-text-4 underline underline-offset-2 md:text-body1-normal"
          >
            전체 보기
          </button>
        }
        className={cn('min-h-68.75 md:min-h-87.5', className)}
      />
      <WeakTopicsModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
