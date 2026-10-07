import { useEffect, type RefObject } from 'react';

interface UsePopoverDismissParams {
  isOpen: boolean;
  onDismiss: () => void;
  /** 트리거 + 팝오버를 함께 감싸는 컨테이너. 이 바깥 클릭만 닫기로 센다. */
  containerRef: RefObject<HTMLElement | null>;
}

/** 팝오버를 외부 클릭·Esc 로 닫는다. (ADR-1: 단일 사용처 전용, shared 로 올리지 않는다) */
export function usePopoverDismiss({ isOpen, onDismiss, containerRef }: UsePopoverDismissParams) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        onDismiss();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onDismiss, containerRef]);
}
