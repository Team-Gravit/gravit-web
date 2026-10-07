import type { ReactNode } from 'react';

import type { OptionResponse } from '@/shared/api/generated/model';
import { Accordion } from '@/shared/ui/accordion';

import {
  CORRECT_ANSWER_MESSAGE,
  INCORRECT_ANSWER_MESSAGE,
  OPTION_RESULTS,
  type OptionResult,
} from '../model/constants';
import { OPTION_ROW_CLASS, OptionRow } from './option-row';

const RESULT_BORDER_CLASS: Record<OptionResult, string> = {
  correct: 'border-semantic-success',
  incorrect: 'border-semantic-error',
  neutral: '',
};

export interface OptionResultListProps {
  options: OptionResponse[];
  selectedOptionId: number;
  /** 정답을 맞혔을 때 그 선지의 해설 아래에 둘 조작. 틀렸으면 그리지 않는다. */
  correctAction?: ReactNode;
}

/**
 * 제출한 객관식 선지와 해설
 */
export function OptionResultList({
  options,
  selectedOptionId,
  correctAction,
}: OptionResultListProps) {
  return (
    <ul data-slot="option-result-list" className="flex flex-col gap-3">
      {options.map((option, index) => {
        const result = toOptionResult(option, selectedOptionId);
        const isSelected = option.optionId === selectedOptionId;

        return (
          <li key={option.optionId}>
            <Accordion
              data-result={result}
              // 정답 선지는 항상 오픈
              defaultOpen={option.isAnswer}
              className={RESULT_BORDER_CLASS[result]}
              headerClassName={OPTION_ROW_CLASS}
              title={
                <OptionRow
                  number={index + 1}
                  content={option.content}
                  result={result}
                  message={
                    isSelected
                      ? option.isAnswer
                        ? CORRECT_ANSWER_MESSAGE
                        : INCORRECT_ANSWER_MESSAGE
                      : undefined
                  }
                />
              }
            >
              <p className="text-body2-reading text-text-1 rounded-8 bg-bg-1 px-4 py-3 whitespace-pre-line md:text-body2-normal">
                {option.explanation}
              </p>
              {correctAction && isSelected && option.isAnswer ? (
                <div className="mt-2 flex justify-end">{correctAction}</div>
              ) : null}
            </Accordion>
          </li>
        );
      })}
    </ul>
  );
}

function toOptionResult(option: OptionResponse, selectedOptionId: number): OptionResult {
  if (option.isAnswer) {
    return OPTION_RESULTS.correct;
  }

  if (option.optionId === selectedOptionId) {
    return OPTION_RESULTS.incorrect;
  }

  return OPTION_RESULTS.neutral;
}
