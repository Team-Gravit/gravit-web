import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

interface MicPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** '홈으로 가기' — 메인으로 이동한다. */
  onGoHome: () => void;
  /** '권한 확인하기' — 웹에서는 지금 할 일이 없어 모달만 닫는다. */
  onConfirm: () => void;
}

/** 음성 모드에서 마이크 권한이 없을 때 띄우는 안내 모달. 시안 14371:33095. */
export function MicPermissionModal({
  open,
  onOpenChange,
  onGoHome,
  onConfirm,
}: MicPermissionModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-[470px] p-4 pt-6 md:px-8 md:py-7"
    >
      <div className="flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <ModalTitle className="text-headline1 md:text-heading1 text-text-1">
            마이크 권한이 필요해요
          </ModalTitle>
          <ModalDescription className="text-label1 md:text-headline1 text-text-4">
            면접 연습을 시작하려면 마이크 접근을 허용해주세요
          </ModalDescription>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="stroke-neutral" size="cta" className="flex-1" onClick={onGoHome}>
            홈으로 가기
          </Button>
          <Button size="cta" className="flex-1" onClick={onConfirm}>
            권한 확인하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
