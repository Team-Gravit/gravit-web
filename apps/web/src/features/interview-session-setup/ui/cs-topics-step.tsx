import { cn } from '@/shared/lib/cn';
import { Checkbox } from '@/shared/ui/checkbox';
import { Skeleton } from '@/shared/ui/skeleton';

import { useCsTopics, type InterviewTopicResponse } from '@/entities/interview';

import { isAllTopicsSelected } from '../model/session-setup-rules';
import { useSessionSetupStore } from '../model/session-setup-store';
import { QueryFallback } from './query-fallback';

// 조회 전후에 목록 배치가 바뀌지 않도록 실제 항목과 스켈레톤이 같은 클래스를 쓴다.
const TOPIC_LIST_CLASSES =
  'grid grid-cols-1 gap-3 md:grid-flow-col md:grid-cols-2 md:grid-rows-3 md:gap-x-6 md:gap-y-4';
const TOPIC_ITEM_CLASSES =
  'w-full bg-bg-0 px-4 py-4.5 md:px-12 md:py-7 rounded-12 text-text-1 text-headline2 md:text-heading1';
const SELECT_ALL_CLASSES =
  'text-text-1 text-label1 md:text-heading1 flex items-center gap-2 md:gap-4 self-end';
const CHECKBOX_SIZE_CLASSES = 'size-5 md:size-6.5';

// 현재 CS 선택지는 5개다. 목록을 받기 전에도 같은 수의 자리를 확보한다.
const TOPIC_SKELETON_COUNT = 5;

/**
 * CS 면접에서 분야를 여러 개 고른다. 표시명은 서버 목록에서, 선택값은 store에서 가져온다.
 * 최초 조회 중에는 스켈레톤을 보여주고, 목록 없이 조회가 실패하면 재시도를 제공한다.
 */
export function CsTopicsStep() {
  const { data: topics, isError, refetch } = useCsTopics();

  if (topics) {
    return <CsTopicChecklist topics={topics} />;
  }
  if (isError) {
    return <QueryFallback isError onRetry={() => void refetch()} />;
  }
  return <CsTopicChecklistSkeleton />;
}

function CsTopicChecklist({ topics }: { topics: InterviewTopicResponse[] }) {
  const selectedTopics = useSessionSetupStore((state) => state.topics);
  const toggleTopic = useSessionSetupStore((state) => state.toggleTopic);
  const toggleAllTopics = useSessionSetupStore((state) => state.toggleAllTopics);

  const availableTopics = topics.map(({ topic }) => topic);
  // 개별 항목을 해제하면 전체 선택 표시도 함께 풀려야 하므로 별도 상태를 두지 않는다.
  const isAllSelected = isAllTopicsSelected(selectedTopics, availableTopics);

  return (
    <div className="flex flex-col gap-6">
      <label className={SELECT_ALL_CLASSES}>
        <Checkbox
          className={CHECKBOX_SIZE_CLASSES}
          checked={isAllSelected}
          onChange={() => toggleAllTopics(availableTopics)}
        />
        전체 선택
      </label>
      <ul className={TOPIC_LIST_CLASSES}>
        {topics.map(({ topic, displayName }) => (
          <li key={topic} className={TOPIC_ITEM_CLASSES}>
            <label className="flex items-center gap-3 md:gap-4">
              <Checkbox
                className={CHECKBOX_SIZE_CLASSES}
                checked={selectedTopics.includes(topic)}
                onChange={() => toggleTopic(topic)}
              />
              {displayName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CsTopicChecklistSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span aria-hidden="true" className={SELECT_ALL_CLASSES}>
        <Skeleton variant="block" className={cn('rounded-4', CHECKBOX_SIZE_CLASSES)} />
        전체 선택
      </span>
      <ul aria-hidden="true" className={TOPIC_LIST_CLASSES}>
        {Array.from({ length: TOPIC_SKELETON_COUNT }, (_, index) => (
          <li key={index} className={TOPIC_ITEM_CLASSES}>
            <span className="flex items-center gap-3 md:gap-4">
              <Skeleton variant="block" className={cn('rounded-4', CHECKBOX_SIZE_CLASSES)} />
              <Skeleton textSize="headline2" className="w-24 md:w-32 md:text-heading1" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
