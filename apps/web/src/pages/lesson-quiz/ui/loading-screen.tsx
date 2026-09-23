import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import animatedMascot from './assets/loading-mascot.webp';
import staticMascot from './assets/loading-mascot-static.webp';

const LOADING_MESSAGE = '로딩중...';
const DEFAULT_TIP = '시즌은 매주 월요일 자정에 초기화돼요.';

export interface LoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {
  tip?: string;
}

export function LoadingScreen({ tip = DEFAULT_TIP, className, ...props }: LoadingScreenProps) {
  return (
    <div
      data-slot="loading-screen"
      className={cn(
        'flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center',
        className,
      )}
      {...props}
    >
      <div className="flex w-full max-w-114 flex-col items-center gap-5 md:gap-8">
        {/* 움직임이 큰 이미지라 모션 감소 환경에서는 정지 프레임을 보여준다. */}
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={staticMascot} />
          <img
            src={animatedMascot}
            alt=""
            fetchPriority="high"
            className="h-[20.625rem] w-auto max-w-full object-contain md:h-115"
          />
        </picture>

        <div className="flex w-full flex-col items-center gap-2 md:gap-3">
          <p aria-live="polite" className="text-heading1 text-text-1 md:text-title2">
            {LOADING_MESSAGE}
          </p>
          <p className="text-body2-normal text-text-4 md:text-headline1">{tip}</p>
        </div>
      </div>
    </div>
  );
}
