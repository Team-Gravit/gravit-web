import { Fragment } from 'react';

import { cn } from '@/shared/lib/cn';
import { INTERVIEW_HISTORY_SORT_LABEL, type InterviewHistorySort } from '@/entities/interview';

const SORT_OPTIONS: InterviewHistorySort[] = ['LATEST', 'OLDEST'];

export interface HistorySortToggleProps {
  sort: InterviewHistorySort;
  onSortChange: (sort: InterviewHistorySort) => void;
  className?: string;
}

export function HistorySortToggle({ sort, onSortChange, className }: HistorySortToggleProps) {
  return (
    <div
      role="group"
      aria-label="정렬"
      className={cn('flex items-center gap-2 md:gap-3', className)}
    >
      {SORT_OPTIONS.map((option, index) => {
        const isSelected = option === sort;

        return (
          <Fragment key={option}>
            {index > 0 ? (
              <span aria-hidden className="hidden h-3.75 w-px bg-text-4 md:block" />
            ) : null}
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSortChange(option)}
              className={cn(
                'cursor-pointer text-headline2',
                isSelected
                  ? 'text-text-2 md:text-main-1'
                  : 'text-text-4 md:text-body1-normal md:text-text-2',
              )}
            >
              {INTERVIEW_HISTORY_SORT_LABEL[option]}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
