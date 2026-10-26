import { cn } from '@/shared/lib/cn';
import {
  getAccuracyLevel,
  type AccuracyLevel,
  type InterviewTopicAccuracyResponse,
} from '@/entities/interview';

const ACCURACY_TEXT_CLASS: Record<AccuracyLevel, string> = {
  low: 'text-semantic-error',
  medium: 'text-semantic-warning',
  high: 'text-semantic-success',
};

export interface WeakTopicItemProps {
  topicAccuracy: InterviewTopicAccuracyResponse;
}

export function WeakTopicItem({ topicAccuracy }: WeakTopicItemProps) {
  const { topic, accuracyRate } = topicAccuracy;
  const level = getAccuracyLevel(accuracyRate);

  return (
    <li className="flex flex-col justify-center gap-2 rounded-6 bg-bg-2 p-4 md:min-h-18.5 md:rounded-8 md:bg-bg-1 md:px-4 md:py-3">
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-label1 text-text-2 md:text-heading2">
          {topic.displayName}
        </span>
        <span className={cn('shrink-0 text-caption1 md:text-label1', ACCURACY_TEXT_CLASS[level])}>
          정확도 {accuracyRate}%
        </span>
      </div>
      <AccuracyBar accuracyRate={accuracyRate} />
    </li>
  );
}

function AccuracyBar({ accuracyRate }: { accuracyRate: number }) {
  return (
    <div aria-hidden className="h-2 overflow-hidden rounded-full bg-bg-3">
      {accuracyRate > 0 ? (
        <div
          className="h-full rounded-full bg-linear-to-r from-semantic-error via-semantic-warning to-semantic-success"
          // 그라디언트는 막대 전체 폭 기준이다. 채운 길이만큼 잘라 보여야 낮은 정확도가 붉게 남는다.
          style={{ width: `${accuracyRate}%`, backgroundSize: `${10000 / accuracyRate}% 100%` }}
        />
      ) : null}
    </div>
  );
}
