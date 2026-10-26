import { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { useInterviewSessionStore } from '@/entities/interview-session';

import { useAnswerReady } from '../model/use-answer-ready';
import { AnswerButton } from './answer-button';

export function TextAnswerButton() {
  const goNext = useInterviewSessionStore((s) => s.goNext);
  const setAnswerContent = useInterviewSessionStore((s) => s.setAnswerContent);
  const currentIndex = useInterviewSessionStore((s) => s.currentIndex);
  const startAnswering = useInterviewSessionStore((s) => s.startAnswering);
  const [answer, setAnswer] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  // 질문 음성이 끝나야 답변 작성을 시작할 수 있다(문항 전환 중에는 비활성).
  const canAnswer = useAnswerReady();

  if (!isWriting) {
    return (
      <div className="flex w-full items-center justify-center p-4 md:py-12.5">
        <AnswerButton
          onClick={() => {
            setIsWriting(true);
            startAnswering();
          }}
          disabled={!canAnswer}
        >
          {canAnswer ? '답변 작성하기' : '질문 재생 중'}
        </AnswerButton>
      </div>
    );
  }

  const handleSubmitAnswer = () => {
    setAnswerContent(currentIndex + 1, answer);
    goNext();
    setAnswer('');
    setIsWriting(false);
  };

  return (
    <div className="flex w-full items-end gap-4 px-5 py-4 md:px-8 md:mt-6 md:items-center md:bg-bg-0">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 입력해주세요."
        className={cn(
          'flex-1 resize-none overflow-y-auto rounded-8 bg-bg-1 px-3 py-4 outline-none',
          'text-body2-normal text-text-1 placeholder:text-text-4',
          // 모바일: 내용 따라 54→136 늘어남. 데스크톱: 120 고정(min=max).
          'h-[136px] md:h-[122px] md:rounded-20 md:px-6 md:text-headline1',
        )}
      />
      <AnswerButton
        onClick={handleSubmitAnswer}
        disabled={!answer}
        className="size-8 flex-none md:h-[54px] md:w-[230px]"
      >
        <Icon
          name="paper-plane-fill"
          className={cn('md:hidden', answer ? 'fill-bg-0' : 'fill-text-3-w')}
        />
        <span className="hidden md:block">답변 완료하기</span>
      </AnswerButton>
    </div>
  );
}
