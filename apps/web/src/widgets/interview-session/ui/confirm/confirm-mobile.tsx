import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { RecordingPlayer } from '@/shared/ui/recording-player';
import { InterviewAbandonButton } from '@/features/interview-abandon';

import { ConfirmAnswerChip, ConfirmAnswerField } from './confirm-answer-field';
import { ConfirmQuestionCard } from './confirm-question-card';
import type { ConfirmItem, ConfirmLayoutProps } from './types';

const TITLE = '답변을 확인해주세요.';
const SUBTITLE =
  '음성 인식 과정에서 생긴 오타만 고쳐주세요.\n답변 내용을 새로 쓰는 용도는 아니에요.';

export function ConfirmMobile({ items, isPending, onSubmit }: ConfirmLayoutProps) {
  const [openOrders, setOpenOrders] = useState<number[]>(() =>
    items.map((item) => item.displayOrder),
  );

  const toggle = (order: number) =>
    setOpenOrders((prev) =>
      prev.includes(order) ? prev.filter((value) => value !== order) : [...prev, order],
    );

  return (
    <div className="flex h-svh flex-col bg-bg-2">
      <header className=" relative flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-bg-0">
        <div className="absolute top-0 left-0">
          <InterviewAbandonButton />
        </div>
        <p className="text-label1 text-text-2">답변 확인 및 수정</p>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        <div className="flex flex-col gap-2">
          <p className="text-heading2 text-text-1">{TITLE}</p>
          <p className="text-caption1 whitespace-pre-line text-text-3">{SUBTITLE}</p>
        </div>

        {items.map((item) => (
          <div key={item.displayOrder} className="flex flex-col gap-3">
            <ConfirmQuestionCard order={item.displayOrder} question={item.question} compact />
            <AnswerAccordion
              item={item}
              open={openOrders.includes(item.displayOrder)}
              onToggle={() => toggle(item.displayOrder)}
            />
          </div>
        ))}
      </div>

      <div className="shrink-0 p-4">
        <Button size="cta" className="w-full" isLoading={isPending} onClick={onSubmit}>
          제출하기
        </Button>
      </div>
    </div>
  );
}

function AnswerAccordion({
  item,
  open,
  onToggle,
}: {
  item: ConfirmItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-8 bg-bg-0 p-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex cursor-pointer items-center justify-between outline-none"
      >
        <ConfirmAnswerChip order={item.displayOrder} />
        <span className="text-caption1 flex items-center gap-1 text-text-4">
          펼쳐서 보기
          <Icon name={open ? 'chevron-up' : 'chevron-down'} className="size-6" />
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 rounded-6 border border-divider-1 bg-bg-1 p-4 h-[146px]">
            <span className="text-caption1 text-text-4">내 답변</span>
            <ConfirmAnswerField order={item.displayOrder} status={item.status} />
          </div>
          {item.audioUrl && <RecordingPlayer size="sm" audioUrl={item.audioUrl} />}
        </div>
      )}
    </div>
  );
}
