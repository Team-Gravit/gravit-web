import type { OptionResponse } from '@/shared/api/generated/model';
import { cn } from '@/shared/lib/cn';

import { OPTION_ROW_CLASS, OptionRow } from './option-row';

export interface OptionChoiceListProps {
  options: OptionResponse[];
  onSelect: (optionId: number) => void;
}

/**
 * 아직 제출하지 않은 객관식 선지 리스트
 *
 * - 라디오가 아니라 버튼 - 누르면 제출됨
 */
export function OptionChoiceList({ options, onSelect }: OptionChoiceListProps) {
  return (
    <ul data-slot="option-choice-list" className="flex flex-col gap-3">
      {options.map((option, index) => (
        <li key={option.optionId}>
          <button
            type="button"
            onClick={() => onSelect(option.optionId)}
            className={cn(
              OPTION_ROW_CLASS,
              'group cursor-pointer border border-transparent bg-white',
              'hover:bg-bg-2 hover:border-divider-2',
              'active:bg-white active:border-main-1',
              'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
            )}
          >
            <OptionRow number={index + 1} content={option.content} />
          </button>
        </li>
      ))}
    </ul>
  );
}
