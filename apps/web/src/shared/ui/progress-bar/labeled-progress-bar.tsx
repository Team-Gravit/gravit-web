import { useId } from 'react';

import { cn } from '@/shared/lib/cn';

import { ProgressBar, clampPercent } from './progress-bar';

export interface LabeledProgressBarProps {
  label: string;
  /** 0~100. 범위를 벗어나면 게이지와 표시값 모두 보정한다. */
  value: number;
  className?: string;
  /** 라벨 타이포·색. 기본은 챕터 제목용(굵게). 「진행률」처럼 보조 라벨이면 덮어쓴다. */
  labelClassName?: string;
  valueClassName?: string;
}

/** 같은 보정값을 퍼센트 텍스트와 게이지에 반영한다. */
export function LabeledProgressBar({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: LabeledProgressBarProps) {
  const labelId = useId();
  const percent = clampPercent(value);

  return (
    <div data-slot="labeled-progress-bar" className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          id={labelId}
          className={cn(
            'min-w-0 truncate text-headline2 text-text-2 md:text-title3 md:text-text-1',
            labelClassName,
          )}
        >
          {label}
        </span>
        <span
          data-slot="progress-percent"
          className={cn('shrink-0 text-label1 text-main md:text-body1-normal', valueClassName)}
        >
          {percent}%
        </span>
      </div>
      <ProgressBar value={percent} aria-labelledby={labelId} />
    </div>
  );
}
