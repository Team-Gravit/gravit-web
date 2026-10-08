import { useEffect, useState, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import { useToastStore } from './toast-store';

// 사라질 때의 페이드아웃 시간. 이 시간이 지난 뒤 실제로 언마운트한다.
const EXIT_MS = 200;

const toastVariants = cva(
  [
    'pointer-events-auto w-full max-w-md md:w-auto',
    // bg-text-1 은 #242424 토큰(토스트 표면색). 텍스트는 흰색이라 대비를 유지한다.
    'rounded-6 bg-text-1 px-4 py-3 md:rounded-8 md:px-8 md:py-6 md:min-w-[630px]',
    'text-center text-label1 text-white md:text-headline1',
    'transition duration-500 ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      entered: {
        true: 'translate-y-0 opacity-100',
        false: 'translate-y-2 opacity-0',
      },
    },
  },
);

// 하단 위치는 모바일 바텀탭 위에 뜨도록 탭 높이만큼 띄운다(데스크톱은 탭이 없어 고정 여백).
const POSITION_CLASS = {
  bottom: 'bottom-[calc(var(--bottom-tab-height)+20px)] md:bottom-10',
  top: 'top-10',
} as const;

/** 전역 단일 토스트 렌더러. 앱 셸에 한 번 마운트한다. */
export function Toaster(): ReactPortal | null {
  const toast = useToastStore((state) => state.toast);
  const dismiss = useToastStore((state) => state.dismiss);

  if (!toast) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4',
        POSITION_CLASS[toast.position],
      )}
    >
      {/* key 로 토스트마다 새로 마운트해 enter 애니메이션·타이머가 처음부터 다시 시작되게 한다. */}
      <ToastItem
        key={toast.id}
        message={toast.message}
        duration={toast.duration}
        onDismiss={dismiss}
      />
    </div>,
    document.body,
  );
}

interface ToastItemProps {
  message: string;
  duration: number;
  onDismiss: () => void;
}

function ToastItem({ message, duration, onDismiss }: ToastItemProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setEntered(true));
    const hideTimer = setTimeout(() => setEntered(false), duration);
    const clearTimer = setTimeout(onDismiss, duration + EXIT_MS);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div role="status" aria-live="polite" aria-atomic className={cn(toastVariants({ entered }))}>
      {message}
    </div>
  );
}
