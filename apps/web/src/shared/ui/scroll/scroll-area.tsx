import type { ComponentProps, ReactNode, Ref } from 'react';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

import { cn } from '@/shared/lib/cn';

export interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  /** 스크롤되는 내부 뷰포트 래퍼에 적용할 클래스 */
  viewportClassName?: string;
  orientation?: ComponentProps<typeof RadixScrollArea.Scrollbar>['orientation'];
  /** 스크롤 뷰포트 DOM 참조. 세로 무한스크롤 교차 관찰의 root로 쓴다. */
  viewportRef?: Ref<HTMLDivElement>;
}

/**
 * Radix 기반 커스텀 스크롤 영역. 브라우저 기본 스크롤바 대신 시안 스타일(가는 막대)을 쓴다.
 * 가로로 넓은 콘텐츠(학습 히트맵)나, `className`에 max-height 를 주면 세로로 긴 목록도 감싼다.
 */
export function ScrollArea({
  children,
  className,
  viewportClassName,
  orientation = 'vertical',
  viewportRef,
}: ScrollAreaProps) {
  return (
    <RadixScrollArea.Root className={cn('relative w-full min-w-0 overflow-hidden', className)}>
      {/* max-h-[inherit]: Root 의 max-height 를 이어받아 세로 스크롤이 실제로 생기게 한다.
          (h-full 은 Root 가 height 가 아닌 max-height 만 가지면 해석되지 않아 스크롤이 안 걸린다.) */}
      <RadixScrollArea.Viewport ref={viewportRef} className="size-full max-h-[inherit]">
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
