import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { RecordingPlayer, formatPlaybackTime } from '@/shared/ui/recording-player';
import { StatusNumberButton } from '@/shared/ui/status-number-button';
import { InterviewAbandonButton } from '@/features/interview-abandon';

import { ConfirmAnswerChip, ConfirmAnswerField } from './confirm-answer-field';
import { ConfirmQuestionCard } from './confirm-question-card';
import type { ConfirmItem, ConfirmLayoutProps } from './types';

const TITLE = '답변을 확인해주세요.';
const SUBTITLE =
  '음성 인식 과정에서 생긴 오타만 고쳐주세요. 답변 내용을 새로 쓰는 용도는 아니에요.';

export function ConfirmDesktop({ items, isPending, onSubmit }: ConfirmLayoutProps) {
  const [selected, setSelected] = useState(items[0]?.displayOrder ?? 1);
  const current = items.find((item) => item.displayOrder === selected) ?? items[0];

  return (
    <div className="flex h-svh flex-col bg-bg-2">
      <header className="flex h-[72px] shrink-0 items-center border-b border-divider-1 bg-bg-0 px-5">
        <InterviewAbandonButton />
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-75 shrink-0 flex-col gap-5 border-r border-divider-1 bg-bg-0 p-8">
          <p className="text-headline1 text-text-1">답변 확인</p>
          <ol className="grid grid-cols-5 gap-2">
            {items.map((item) => (
              <li key={item.displayOrder}>
                <StatusNumberButton
                  status={item.displayOrder === selected ? 'selected' : 'completed'}
                  onClick={() => setSelected(item.displayOrder)}
                  className="text-body1-normal"
                >
                  {item.displayOrder}
                </StatusNumberButton>
              </li>
            ))}
          </ol>
        </aside>

        <div className="flex flex-1 flex-col items-center overflow-y-auto py-25">
          <div className="flex w-full max-w-[80%] flex-col gap-15">
            <div className="flex w-full flex-col gap-10">
              <div className="flex flex-col gap-4">
                <p className="text-display2 text-text-1">{TITLE}</p>
                <p className="text-headline1 text-text-4">{SUBTITLE}</p>
              </div>

              {current && (
                <div className="flex flex-col gap-4">
                  <ConfirmQuestionCard order={current.displayOrder} question={current.question} />
                  <AnswerCard item={current} />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button size="cta" className="w-[158px]" isLoading={isPending} onClick={onSubmit}>
                제출하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerCard({ item }: { item: ConfirmItem }) {
  return (
    <div className="flex h-[425px] gap-6 rounded-12 bg-bg-0 p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.02)]">
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex min-h-0 flex-1 flex-col gap-6 pb-6">
          <div>
            <ConfirmAnswerChip order={item.displayOrder} />
          </div>
          <ConfirmAnswerField
            order={item.displayOrder}
            status={item.status}
            className="scrollbar-hide h-full flex-1"
          />
        </div>
        {item.audioUrl && (
          <RecordingPlayer
            key={item.displayOrder}
            audioUrl={item.audioUrl}
            renderLabel={({ remaining }) => (
              <span className="flex shrink-0 flex-col items-center gap-0.5">
                <span className="text-headline2 text-text-1">답변 재생하기</span>
                <span className="text-label1 text-text-4">
                  남은시간 {formatPlaybackTime(remaining)}
                </span>
              </span>
            )}
          />
        )}
      </div>
    </div>
  );
}
