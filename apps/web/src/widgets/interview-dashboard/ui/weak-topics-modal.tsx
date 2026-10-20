import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal, ModalTitle } from '@/shared/ui/modal';
import { ScrollArea } from '@/shared/ui/scroll';
import { Skeleton } from '@/shared/ui/skeleton';
import { useInterviewWeakTopics } from '@/entities/interview';

import { WEAK_TOPICS_EMPTY_MESSAGE, WEAK_TOPICS_TITLE } from '../model/weak-topics';
import { WeakTopicItem } from './weak-topic-item';

export interface WeakTopicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WeakTopicsModal({ open, onOpenChange }: WeakTopicsModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="flex h-111.25 flex-col overflow-hidden rounded-8 bg-bg-1 p-0 md:h-156 md:max-w-157.5 md:rounded-12 md:bg-bg-0"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-divider-1 px-4 py-2 md:px-6 md:py-5">
        <ModalTitle className="text-body2-normal text-text-4 md:text-body1-normal">
          {WEAK_TOPICS_TITLE}
        </ModalTitle>
        <IconButton
          icon="close-md"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          // 40px 클릭 영역은 유지하고 시안의 24px 아이콘 위치에 맞춘다.
          className="md:-m-2"
        />
      </div>
      {/* Modal의 콘텐츠는 닫혀 있을 때 마운트되지 않아 전체 목록 조회도 열 때 시작된다. */}
      <WeakTopicsModalBody />
    </Modal>
  );
}

function WeakTopicsModalBody() {
  const { data: allWeakTopics, isPending, isError, refetch } = useInterviewWeakTopics();

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 p-4 md:px-8 md:pt-4 md:pb-8">
        <Skeleton variant="block" aria-busy="true" className="flex-1 rounded-8" />
      </div>
    );
  }
  if (isError) {
    return (
      <CardRetryStatus
        sectionName={WEAK_TOPICS_TITLE}
        onRetry={() => void refetch()}
        className="flex-1"
      />
    );
  }
  if (allWeakTopics.length === 0) {
    return (
      <CardStatus message={WEAK_TOPICS_EMPTY_MESSAGE} className="flex-1 whitespace-pre-line" />
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1" viewportClassName="p-4 md:px-8 md:pt-4 md:pb-8">
      <ul className="flex flex-col gap-2 md:gap-3">
        {allWeakTopics.map((topicAccuracy) => (
          <WeakTopicItem key={topicAccuracy.topic.topic} topicAccuracy={topicAccuracy} />
        ))}
      </ul>
    </ScrollArea>
  );
}
