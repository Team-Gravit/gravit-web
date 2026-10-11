import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { SessionSetupProgress } from '../model/session-setup-rules';

// WEB-AI-04(14370:39290) · APP-AI-05(14370:38584).
// 한 자리 숫자가 원의 중앙에 오도록 타이포 토큰의 자간과 줄 높이를 여기서만 조정한다.
const stepNumberVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full text-text-1-w tracking-normal leading-none',
  {
    variants: {
      isCurrent: {
        true: 'size-6 bg-purple-400 text-label1 md:size-8 md:text-headline1',
        false: 'size-4 bg-bg-3 text-caption1 md:size-6 md:text-headline2',
      },
    },
  },
);

const stepItemVariants = cva(
  'flex flex-col items-center justify-center gap-1 rounded-12 md:gap-2.5 md:px-6 md:py-3',
  {
    variants: {
      isCurrent: { true: 'px-3', false: 'px-1' },
    },
  },
);

const stepLabelVariants = cva('whitespace-nowrap text-center text-caption1 md:text-headline2', {
  variants: {
    isCurrent: {
      true: 'text-purple-700',
      false: 'text-text-4',
    },
  },
});

export interface SetupProgressProps {
  progress: SessionSetupProgress;
  className?: string;
}

/** 모드에 맞는 단계와 현재 위치를 표시한다. 단계 이동 기능은 없으며 하단 버튼으로 이동한다. */
export function SetupProgress({ progress, className }: SetupProgressProps) {
  return (
    <ol
      aria-label="진행 단계"
      data-slot="setup-progress"
      className={cn('flex items-center p-1 md:p-1.5', className)}
    >
      {progress.labels.map((label, index) => {
        const isCurrent = index === progress.currentIndex;

        return (
          <li
            key={label}
            aria-current={isCurrent ? 'step' : undefined}
            className="flex items-center"
          >
            <div className={stepItemVariants({ isCurrent })}>
              <span aria-hidden="true" className={stepNumberVariants({ isCurrent })}>
                {index + 1}
              </span>
              <span className={stepLabelVariants({ isCurrent })}>{label}</span>
            </div>
            {index < progress.labels.length - 1 && (
              // 연결선은 시안처럼 정사각형 틀의 윗변에 두어 원 중심보다 위에 놓는다.
              <span
                aria-hidden="true"
                className="size-3 shrink-0 border-t border-divider-1 md:size-7"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
