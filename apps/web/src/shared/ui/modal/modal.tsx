import type { ComponentProps, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/shared/lib/cn';
import { SpaceBackground } from '@/shared/ui/layout';

// 글래스 카드 배경. 클래스로 주면 기본 bg와 그룹이 갈려 섞이므로 inline style로 준다.
const GLASS_GRADIENT =
  'linear-gradient(108deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 100%)';

/** 카드 표면. `card`=흰 카드, `glass`=우주 배경 위에 얹는 반투명 글래스 카드. */
export type ModalSurface = 'card' | 'glass';
/** backdrop. `dim`=어두운 반투명, `space`=전체화면 우주 배경 + dim. */
export type ModalBackdrop = 'dim' | 'space';

export interface ModalProps {
  /** 열림 상태. 제어 컴포넌트로 사용한다. */
  open: boolean;
  /** 열림 상태 변경 요청. Esc·바깥 클릭·닫기 트리거가 호출한다. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  /** 콘텐츠 박스에 덧붙일 클래스(너비 등 레이아웃). */
  className?: string;
  /**
   * Esc·바깥 클릭으로 닫기를 허용할지. 순차 안내 모달처럼 명시적 액션으로만
   * 닫아야 하는 경우 `false`로 둔다.
   */
  dismissible?: boolean;
  /** 카드 표면. 기본 `card`. league 시즌·업적 등 우주 배경 위 모달은 `glass`. */
  surface?: ModalSurface;
  /** backdrop 종류. 기본 `dim`. full-screen 우주 배경 모달은 `space`. */
  backdrop?: ModalBackdrop;
}

export function Modal({
  open,
  onOpenChange,
  children,
  className,
  dismissible = true,
  surface = 'card',
  backdrop = 'dim',
}: ModalProps) {
  const blockDismiss = dismissible ? undefined : (event: Event) => event.preventDefault();
  const isGlass = surface === 'glass';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70">
          {backdrop === 'space' && (
            <SpaceBackground className="absolute inset-0">
              <div className="absolute inset-0 bg-black/40" />
            </SpaceBackground>
          )}
        </Dialog.Overlay>
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-12 focus:outline-none',
            isGlass
              ? 'glass-morphism-border max-w-[630px] p-8 shadow-[0px_4px_32px_rgba(0,0,0,0.02)] backdrop-blur-md after:rounded-12'
              : 'max-w-[600px] bg-white px-4 pt-9 pb-5',
            className,
          )}
          style={
            isGlass
              ? { backgroundColor: 'transparent', backgroundImage: GLASS_GRADIENT }
              : undefined
          }
          onEscapeKeyDown={blockDismiss}
          onPointerDownOutside={blockDismiss}
          onInteractOutside={blockDismiss}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** 접근 가능한 모달 제목. Radix가 aria-labelledby로 연결한다. 시각적으로 숨기려면 className으로 처리한다. */
export function ModalTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn('text-title3 text-main', className)} {...props} />;
}

/** 모달 부제. Radix가 aria-describedby로 연결한다. */
export function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description className={cn('text-caption1 text-text-4', className)} {...props} />;
}
