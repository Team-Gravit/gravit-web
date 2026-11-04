import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export type AnswerButtonProps = ComponentProps<'button'>;

/**
 * AI 면접 답변 CTA 버튼.
 * 시안: default `답변 시작하기`(14370:38031), disabled `질문 재생 중`(14370:38018).
 * 너비는 배치하는 쪽(footer)이 className 으로 정한다.
 */
export function AnswerButton({ className, type = 'button', ...props }: AnswerButtonProps) {
  return (
    <button
      type={type}
      data-slot="answer-button"
      className={cn(
        // 레이아웃·모양
        'inline-flex flex-1 md:flex-none w-[230px] h-[54px] items-center justify-center rounded-full',
        'text-headline2',
        // 1.5px 자리를 항상 확보해 disabled 전환 시 크기가 안 변하게
        'border-[1.5px] border-transparent',
        // 상호작용
        'cursor-pointer select-none transition-colors',
        'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        // default: main 바탕 + 흰 글자
        'bg-main text-white',
        // disabled(질문 재생 중): 흰 바탕 · divider 테두리 · text-4
        'disabled:cursor-not-allowed disabled:border-divider-1 disabled:bg-bg-0 disabled:text-text-4',
        className,
      )}
      {...props}
    />
  );
}
