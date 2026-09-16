import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

const progressBarFillVariants = cva('absolute inset-y-0 left-0 rounded-full', {
  variants: {
    fill: {
      gradient: 'bg-brand-gradient',
      solid: 'bg-main',
    },
  },
  defaultVariants: { fill: 'gradient' },
});

export interface ProgressBarProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof progressBarFillVariants> {
  /** 0~100 범위이며, 벗어난 값은 경계값으로 보정한다. */
  value: number;
  /** 보조기술이 읽을 이름. 화면에 라벨이 있으면 `aria-labelledby`를 사용한다. */
  'aria-label'?: string;
}

export function clampPercent(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

/**
 * 화면별 Figma 채움 스타일은 `fill` variant로 구분한다.
 * 기본값은 기존 사용처의 시각적 계약을 보존하는 `gradient`다.
 */
export function ProgressBar({ value, fill, className, ...props }: ProgressBarProps) {
  const percent = clampPercent(value);

  return (
    <div
      role="progressbar"
      data-slot="progress-bar"
      data-fill={fill ?? 'gradient'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-purple-50', className)}
      {...props}
    >
      <div
        data-slot="progress-bar-fill"
        className={progressBarFillVariants({ fill })}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
