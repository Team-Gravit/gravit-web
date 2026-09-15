import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ProgressBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 0~100. 범위 밖은 잘라낸다. */
  value: number;
  /** 보조기술이 읽을 이름. 라벨이 눈에 보이면 `aria-labelledby` 를 대신 넘긴다. */
  'aria-label'?: string;
}

export function clampPercent(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

/** 가로 게이지. 트랙 `color/purple/50`, 채움 `main/gr` 그라데이션 (Figma). */
export function ProgressBar({ value, className, ...props }: ProgressBarProps) {
  const percent = clampPercent(value);

  return (
    <div
      role="progressbar"
      data-slot="progress-bar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-purple-50', className)}
      {...props}
    >
      <div
        data-slot="progress-bar-fill"
        className="absolute inset-y-0 left-0 rounded-full bg-brand-gradient"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
