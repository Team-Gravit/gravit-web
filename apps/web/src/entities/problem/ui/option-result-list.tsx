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
  neutral: 'border-divider-2',
};

export interface OptionResultListProps {
  options: OptionResponse[];
  selectedOptionId: number;
}

/**
 * 제출한 객관식 선지와 해설
 */
export function OptionResultList({ options, selectedOptionId }: OptionResultListProps) {
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
              <p className="text-label2 text-text-3 rounded-8 bg-bg-1 px-4 py-3 whitespace-pre-line md:text-body2-normal">
                {option.explanation}
              </p>
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
