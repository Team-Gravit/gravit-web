import type { ComponentProps, ReactNode } from 'react';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

import { cn } from '@/shared/lib/cn';

export interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  /** 스크롤되는 내부 뷰포트 래퍼에 적용할 클래스 */
  viewportClassName?: string;
  orientation?: ComponentProps<typeof RadixScrollArea.Scrollbar>['orientation'];
}

/**
 * Radix 기반 커스텀 스크롤 영역. 브라우저 기본 스크롤바 대신 시안 스타일(가는 막대)을 쓴다.
 * 가로 스크롤이 필요한 넓은 콘텐츠(학습 히트맵 등)를 감싼다.
 */
export function ScrollArea({
  children,
  className,
  viewportClassName,
  orientation = 'vertical',
}: ScrollAreaProps) {
  return (
    <RadixScrollArea.Root className={cn('relative w-full min-w-0 overflow-hidden', className)}>
      <RadixScrollArea.Viewport className="size-full">
        <div className={cn('h-fit w-full md:pb-3', viewportClassName)}>{children}</div>
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        orientation={orientation}
        className={cn(
          'flex touch-none select-none',
          orientation === 'vertical' ? 'w-[3px] flex-col md:w-[7px]' : 'h-[3px] md:h-[7px]',
        )}
      >
        <RadixScrollArea.Thumb className="relative rounded-full bg-bg-4" />
      </RadixScrollArea.Scrollbar>
    </RadixScrollArea.Root>
  );
}
