import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { TextField } from '@/shared/ui/text-field';

import { CORRECT_ANSWER_MESSAGE, toIncorrectSubjectiveMessage } from '../model/constants';

export interface AnswerResultProps {
  /** 사용자가 제출한 답*/
  submittedContent: string;
  isCorrect: boolean;
  /** 오답일 때 알려줄 정답 */
  correctAnswers: string[];
  explanation: string;
  /** 정답을 맞혔을 때 해설 아래에 둘 조작. 틀렸으면 그리지 않는다. */
  correctAction?: ReactNode;
}

/**
 * 주관식 제출 결과
 */
export function AnswerResult({
  submittedContent,
  isCorrect,
  correctAnswers,
  explanation,
  correctAction,
}: AnswerResultProps) {
  const tone = isCorrect ? 'success' : 'error';

  return (
    <div
      data-slot="answer-result"
      data-result={isCorrect ? 'correct' : 'incorrect'}
      className="flex flex-col gap-4 md:gap-10"
    >
      <TextField value={submittedContent} tone={tone} readOnly aria-label="제출한 답" />
      <div className="flex flex-col gap-2 md:gap-4">
        <p
          className={cn(
            'text-body1-normal md:text-headline1',
            isCorrect ? 'text-semantic-success' : 'text-semantic-error',
          )}
        >
          {isCorrect ? CORRECT_ANSWER_MESSAGE : toIncorrectSubjectiveMessage(correctAnswers)}
        </p>
        <p className="text-text-1 rounded-8 bg-bg-2 p-4 whitespace-pre-line text-body2-reading">
          {explanation}
        </p>
        {correctAction && isCorrect ? (
          <div className="flex justify-end">{correctAction}</div>
        ) : null}
      </div>
    </div>
  );
}
