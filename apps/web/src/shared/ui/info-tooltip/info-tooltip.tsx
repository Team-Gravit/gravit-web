import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';

import { cn } from '@/shared/lib/cn';
import { Icon, InfoIcon } from '@/shared/ui/icon';

// 스크롤 중 커서 밑을 지나가기만 한 아이콘이 열리지 않도록, 잠시 머물러야 연다.
const HOVER_OPEN_DELAY_MS = 300;
// 아이콘에서 말풍선으로 커서를 옮기는 사이에 닫히지 않게 한다.
const HOVER_CLOSE_DELAY_MS = 100;

export interface InfoTooltipProps {
  /** 말풍선에 보일 설명. */
  content: ReactNode;
  /** 아이콘 버튼의 접근 가능한 이름. 무엇에 대한 설명인지 밝힌다. */
  label: string;
  /** 아이콘 버튼의 레이아웃·색. */
  className?: string;
}

/**
 * `i` 아이콘을 눌러 설명을 보는 말풍선.
 *
 * - 터치: 탭하면 열고, 다시 탭하거나 바깥을 누르면 닫는다
 * - 마우스: 잠시 올려 두면 열고 떼면 닫는다. 클릭하면 고정되어 바깥 클릭이나 Esc 로 닫는다
 * - 키보드: Enter · Space 로 열고 Esc 로 닫는다
 * - 스크롤하면 어떻게 열었든 닫는다. 아이콘을 따라 헤더 · 하단 탭 위로 올라가지 않게 한다
 *
 * hover 전용 툴팁은 터치에서 열 수 없어 popover 로 만든다.
 */
export function InfoTooltip({ content, label, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearHoverTimer = () => clearTimeout(hoverTimerRef.current);

  const close = () => {
    clearHoverTimer();
    setIsOpen(false);
    setIsPinned(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      clearTimeout(hoverTimerRef.current);
      setIsOpen(false);
      setIsPinned(false);
    };
    // 페이지가 아니라 안쪽 스크롤 영역이 움직여도 잡도록 capture 단계에서 듣는다.
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    clearHoverTimer();
    if (!isOpen) {
      hoverTimerRef.current = setTimeout(() => setIsOpen(true), HOVER_OPEN_DELAY_MS);
    }
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || isPinned) {
      return;
    }
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => setIsOpen(false), HOVER_CLOSE_DELAY_MS);
  };

  // Radix 의 기본 토글은 hover 로 열린 상태에서 클릭하면 닫아 버린다. 클릭은 고정 여부만 바꾼다.
  const handleTriggerClick = (event: MouseEvent) => {
    event.preventDefault();
    if (isPinned) {
      close();
      return;
    }
    clearHoverTimer();
    setIsPinned(true);
    setIsOpen(true);
  };

  // 바깥 클릭 · Esc 로 닫힐 때
  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      close();
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        type="button"
        aria-label={label}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleTriggerClick}
        className={cn(
          'inline-flex shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white',
          className,
        )}
      >
        <Icon icon={InfoIcon} className="size-full" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={6}
          collisionPadding={16}
          // 설명만 보여 주는 말풍선이라 열릴 때 포커스를 옮기지 않는다.
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={cn(
            // z-35: 카드 내용(z-30)보다 위, 하단 탭(z-40) · 헤더(z-50)보다 아래
            'z-35 max-w-64 rounded-8 bg-text-1 px-3 py-2 text-label2 break-keep text-text-1-w shadow-elevation-3',
            // 아이콘 쪽에서 커지며 나타나도록 Radix 가 계산한 기준점을 쓴다.
            'origin-(--radix-popover-content-transform-origin)',
            'data-[state=open]:animate-tooltip-in data-[state=closed]:animate-tooltip-out motion-reduce:animate-none',
          )}
        >
          {content}
          <Popover.Arrow width={12} height={6} className="fill-text-1" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
