import { cn } from '@/shared/lib/cn';

import type { OptionResult } from '../model/constants';
import { OptionMarker } from './option-marker';

export const OPTION_ROW_CLASS =
  'flex w-full items-center gap-3 rounded-8 p-3 text-left md:gap-4 md:px-4 md:py-[11px]';

const RESULT_TEXT_CLASS: Record<OptionResult, string> = {
  correct: 'text-semantic-success',
  incorrect: 'text-semantic-error',
  neutral: 'text-text-3',
};

export interface OptionRowProps {
  number: number;
  content: string;
  result?: OptionResult;
  message?: string;
}

/**
 * 번호 표식과 선지 내용
 */
export function OptionRow({ number, content, result, message }: OptionRowProps) {
  const textClass = result ? RESULT_TEXT_CLASS[result] : 'text-text-3';

  return (
    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-4">
      <OptionMarker number={number} result={result} />
      <span className={cn('text-label2 md:text-body1-normal', textClass)}>{content}</span>
      {message ? <span className={cn('text-label2', textClass)}>{message}</span> : null}
    </span>
  );
}
