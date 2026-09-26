import type { OptionResponse } from '@/shared/api/generated/model';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

import { OPTION_ROW_CLASS, OptionRow } from './option-row';

export interface OptionChoiceListProps {
  options: OptionResponse[];
  onSelect: (optionId: number) => void;
  /** 가려서 선택할 수 없는 선지 ID. */
  hiddenOptionIds?: number[];
  /** 없으면 가리기 버튼을 렌더하지 않는다. */
  onToggleHide?: (optionId: number) => void;
}

/** 제출 전 객관식 선지의 선택과 가리기 동작을 분리해 렌더링한다. */
export function OptionChoiceList({
  options,
  onSelect,
  hiddenOptionIds = [],
  onToggleHide,
}: OptionChoiceListProps) {
  return (
    <ul data-slot="option-choice-list" className="flex flex-col gap-3">
      {options.map((option, index) => {
        const optionNumber = index + 1;
        const isHidden = hiddenOptionIds.includes(option.optionId);

        return (
          <li key={option.optionId} className="relative">
            <button
              type="button"
              disabled={isHidden}
              onClick={() => onSelect(option.optionId)}
              className={cn(
                OPTION_ROW_CLASS,
                'border border-transparent bg-white',
                'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
                isHidden
                  ? 'opacity-40'
                  : cn(
                      'cursor-pointer',
                      'hover:bg-bg-2 hover:border-divider-2',
                      'active:bg-white active:border-main-1',
                    ),
                onToggleHide && 'pr-12 md:pr-13',
              )}
            >
              <OptionRow number={optionNumber} content={option.content} />
            </button>
            {onToggleHide ? (
              <button
                type="button"
                onClick={() => onToggleHide(option.optionId)}
                aria-pressed={isHidden}
                aria-label={`${optionNumber}번 선지 ${isHidden ? '다시 보기' : '가리기'}`}
                className={cn(
                  'absolute top-1/2 right-3 -translate-y-1/2 md:right-4',
                  'text-icon cursor-pointer rounded-8 p-1 outline-none',
                  'hover:bg-bg-2',
                  'focus-visible:ring-3 focus-visible:ring-purple-200',
                  isHidden && 'text-icon-disabled',
                )}
              >
                <Icon name={isHidden ? 'eye-off' : 'eye'} size={20} />
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
