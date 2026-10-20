import { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { CardRetryStatus } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  formatAnswerTitle,
  useInterviewSessionAnswers,
  type InterviewAnswerDetailResponse,
} from '@/entities/interview';

import { AnswerDetail } from './answer-detail';

export interface AnswerDetailsTabProps {
  sessionId: number;
  /** 선택한 문항 순서. 없으면 첫 문항이다. */
  question?: number;
  onQuestionSelect: (displayOrder: number) => void;
  layout: 'wide' | 'narrow';
}

export function AnswerDetailsTab({
  sessionId,
  question,
  onQuestionSelect,
  layout,
}: AnswerDetailsTabProps) {
  const {
    data: sessionAnswers,
    isPending,
    isError,
    refetch,
  } = useInterviewSessionAnswers(sessionId);

  if (isPending) {
    return <Skeleton variant="block" aria-busy="true" className="h-150 rounded-8 md:rounded-12" />;
  }
  if (isError) {
    return (
      <CardRetryStatus
        sectionName="문항별 상세"
        onRetry={() => void refetch()}
        className="rounded-8 bg-white py-20 md:rounded-12"
      />
    );
  }

  const selectedOrder = question ?? sessionAnswers.answers[0]?.displayOrder;

  if (layout === 'wide') {
    const selectedAnswer =
      sessionAnswers.answers.find((answer) => answer.displayOrder === selectedOrder) ??
      sessionAnswers.answers[0];

    return (
      <div className="flex flex-col">
        <div role="tablist" aria-label="문항" className="flex items-end gap-2 pl-6">
          {sessionAnswers.answers.map((answer) => {
            const isSelected = answer.displayOrder === selectedAnswer?.displayOrder;
            return (
              <button
                key={answer.displayOrder}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onQuestionSelect(answer.displayOrder)}
                className={cn(
                  'cursor-pointer rounded-t-8 px-5 text-headline2',
                  isSelected ? 'h-12.75 bg-cta text-cta-text' : 'h-11.25 bg-bg-3 text-text-4',
                )}
              >
                {formatAnswerTitle(answer)}
              </button>
            );
          })}
        </div>
        {selectedAnswer ? (
          <div role="tabpanel" className="overflow-hidden rounded-12 bg-white">
            <AnswerDetail answer={selectedAnswer} layout="wide" />
          </div>
        ) : null}
      </div>
    );
  }

  // 문항별 득점 막대로 들어오면 그 문항을 펼친 채로 다시 시작한다.
  return (
    <AnswerAccordionList
      key={selectedOrder}
      answers={sessionAnswers.answers}
      initialOpenOrder={selectedOrder}
    />
  );
}

interface AnswerAccordionListProps {
  answers: InterviewAnswerDetailResponse[];
  initialOpenOrder?: number;
}

// 시안은 한 번에 한 문항만 펼쳐 보인다.
function AnswerAccordionList({ answers, initialOpenOrder }: AnswerAccordionListProps) {
  const [openOrder, setOpenOrder] = useState(initialOpenOrder);

  return (
    <ul className="flex flex-col gap-3">
      {answers.map((answer) => {
        const isOpen = answer.displayOrder === openOrder;
        return (
          <AnswerAccordionItem
            key={answer.displayOrder}
            answer={answer}
            isOpen={isOpen}
            onToggle={() => setOpenOrder(isOpen ? undefined : answer.displayOrder)}
          />
        );
      })}
    </ul>
  );
}

interface AnswerAccordionItemProps {
  answer: InterviewAnswerDetailResponse;
  isOpen: boolean;
  onToggle: () => void;
}

function AnswerAccordionItem({ answer, isOpen, onToggle }: AnswerAccordionItemProps) {
  const contentId = `answer-${answer.displayOrder}`;

  return (
    <li className="rounded-8 bg-white px-4">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? contentId : undefined}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 py-4"
      >
        <span className="truncate text-headline2 text-main-2">{formatAnswerTitle(answer)}</span>
        <span className="flex shrink-0 items-center gap-1 text-caption1 text-text-4">
          {isOpen ? '접기' : '펼쳐서 보기'}
          <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="text-icon-disabled" />
        </span>
      </button>
      {isOpen ? <AnswerDetail answer={answer} layout="narrow" /> : null}
    </li>
  );
}
