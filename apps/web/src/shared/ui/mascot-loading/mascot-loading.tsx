import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import animatedMascot from './assets/loading-mascot.webp';
import staticMascot from './assets/loading-mascot-static.webp';

export interface MascotLoadingProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 큰 제목(진행 중 안내). */
  message: string;
  /** 보조 설명(선택). */
  description?: string;
}

/** 마스코트 애니메이션 + 안내 문구로 구성한 로딩 화면. 바탕·높이는 className으로 받는다. */
export function MascotLoading({ message, description, className, ...props }: MascotLoadingProps) {
  return (
    <div
      data-slot="mascot-loading"
      className={cn('flex flex-col items-center justify-center px-4 text-center', className)}
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
            {message}
          </p>
          {description && (
            <p className="text-body2-normal text-text-4 md:text-headline1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
