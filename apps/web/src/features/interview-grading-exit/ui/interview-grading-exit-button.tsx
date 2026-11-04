import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

interface InterviewGradingExitButtonProps {
  className?: string;
}

/**
 * 채점 대기 중 나가기 버튼. 채점은 서버에서 계속되므로 중단 요청 없이 안내 모달만 띄우고,
 * 확인 시 별도 메시지 없이 인터뷰 홈으로 이동한다. 목적지는 항상 /interview 로 불변이라 여기서 처리한다.
 */
export function InterviewGradingExitButton({ className }: InterviewGradingExitButtonProps) {
  const isWideViewport = useIsWideViewport();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="채점 중 나가기"
        icon="home"
        iconSize={isWideViewport ? 32 : 24}
        onClick={() => setIsOpen(true)}
        className={cn('bg-white size-12 md:size-15 md:rounded-full', className)}
      />
      <InterviewGradingExitModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => {
          setIsOpen(false);
          navigate({ to: '/interview', replace: true });
        }}
      />
    </>
  );
}

interface InterviewGradingExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** 채점 중 나가기 확인 모달. 디자인은 중단 모달과 같고 문구·동작만 채점 전용이다. */
function InterviewGradingExitModal({
  open,
  onOpenChange,
  onConfirm,
}: InterviewGradingExitModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="flex max-w-[410px] flex-col items-center gap-6 rounded-8 px-4 pt-6 pb-4 md:gap-7 md:rounded-12 md:px-8 md:py-7"
    >
      <div className="flex flex-col items-center gap-2 px-8 text-center">
        <ModalTitle className="text-headline1 text-text-1 md:text-heading1">
          채점은 계속 진행돼요
        </ModalTitle>
        <ModalDescription className="text-label1 text-text-4 md:text-headline1">
          지금 나가도 채점은 멈추지 않아요.
          <br />
          완료된 결과는 최근 응시 이력에서 확인할 수 있어요.
        </ModalDescription>
      </div>

      <div className="flex w-full items-center gap-2 md:gap-3">
        <Button
          variant="stroke-neutral"
          size="cta"
          className="flex-1"
          onClick={() => onOpenChange(false)}
        >
          계속 기다리기
        </Button>
        <Button size="cta" className="flex-1" onClick={onConfirm}>
          홈으로 가기
        </Button>
      </div>
    </Modal>
  );
}
