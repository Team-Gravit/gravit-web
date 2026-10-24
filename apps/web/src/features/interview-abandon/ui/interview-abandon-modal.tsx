import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

interface InterviewAbandonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "N문항 답변이 모두 사라져요" 안내에 쓰는 세션 문항 수. */
  questionCount: number;
  onConfirm: () => void;
  isPending?: boolean;
}

/** 면접 중단 확인 모달. 모바일·데스크톱이 타이포·여백만 다른 같은 다이얼로그다. */
export function InterviewAbandonModal({
  open,
  onOpenChange,
  questionCount,
  onConfirm,
  isPending,
}: InterviewAbandonModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="flex max-w-[410px] flex-col items-center gap-6 rounded-8 px-4 pt-6 pb-4 md:gap-7 md:rounded-12 md:px-8 md:py-7"
    >
      <div className="flex flex-col items-center gap-2 px-8 text-center">
        <ModalTitle className="text-headline1 text-text-1 md:text-heading1">
          정말 나가시겠어요?
        </ModalTitle>
        <ModalDescription className="text-label1 text-text-4 md:text-headline1">
          지금 나가면 채점 결과가 저장되지 않아요.
          <br />
          {questionCount}문항 답변이 모두 사라져요.
        </ModalDescription>
      </div>

      <div className="flex w-full items-center gap-2 md:gap-3">
        <Button
          variant="stroke-neutral"
          size="cta"
          className="flex-1"
          onClick={() => onOpenChange(false)}
        >
          취소
        </Button>
        <Button size="cta" className="flex-1" isLoading={isPending} onClick={onConfirm}>
          나가기
        </Button>
      </div>
    </Modal>
  );
}
