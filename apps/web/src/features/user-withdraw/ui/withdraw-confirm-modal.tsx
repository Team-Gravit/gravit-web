import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

import { useRequestWithdrawal } from '../api/use-withdraw';
import mascotImage from './assets/withdraw-mascot.webp';

export interface WithdrawConfirmModalProps {
  /** 열림 상태. 제어 컴포넌트로 사용한다. */
  open: boolean;
  /** 열림 상태 변경 요청. Esc·바깥 클릭·「그만두기」가 호출한다. */
  onOpenChange: (open: boolean) => void;
  /**
   * 「계속하기」로 탈퇴 인증 메일 요청이 성공한 뒤 호출한다.
   * 확인 모달을 닫고 발송 안내 페이지로 이동하는 등 다음 단계는 호출부가 결정한다.
   */
  onContinue: () => void;
}

/**
 * 탈퇴 확인 모달. 설정 화면에서 「탈퇴하기」를 누르면 열린다.
 * 표면·타이포가 모바일(bg-0 · 22/13)과 데스크톱(bg-1 · 22/18 + elevation-1)에서 달라 반응형으로 분기한다.
 */
export function WithdrawConfirmModal({
  open,
  onOpenChange,
  onContinue,
}: WithdrawConfirmModalProps) {
  const { requestWithdrawal, isPending } = useRequestWithdrawal({
    onSuccess: onContinue,
    onError: () => {
      onOpenChange(false);
      toast('메일 발송에 실패했습니다', { position: 'noneTabBottom' });
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="p-4 md:max-w-[630px] md:rounded-12 md:bg-bg-1 md:p-8 md:shadow-elevation-1"
    >
      <div className="flex flex-col items-center gap-5 md:gap-10">
        <div className="flex flex-col items-center gap-4 py-5 md:gap-8 md:py-10">
          {/* 마스코트는 의미 전달이 아니라 장식이므로 접근성 트리에서 숨긴다. */}
          <img
            src={mascotImage}
            alt=""
            width={211}
            height={239}
            className="w-[150px] md:w-[211px]"
          />
          <div className="flex flex-col items-center gap-1 text-center md:gap-3">
            <ModalTitle className="text-heading1 text-text-1 md:text-text-2">
              정말로...
              <br />
              탈퇴하실건가요?
            </ModalTitle>
            <ModalDescription className="text-label2 text-text-4 md:text-headline1">
              탈퇴 시, 모든 데이터가 삭제됩니다.
            </ModalDescription>
          </div>
        </div>

        <div className="flex w-full gap-3 md:gap-4">
          {/*
            시안의 「그만두기」는 divider-1 테두리 + bg-0 배경 + main 텍스트다. stroke-secondary 를
            기반으로 배경/텍스트만 시안 값으로 맞춘다. 재사용이 확인되면 Button variant 승격을 검토한다.
          */}
          <Button
            variant="stroke-secondary"
            size="cta"
            className="flex-1 bg-bg-0 text-main"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            그만두기
          </Button>
          <Button
            variant="default"
            size="cta"
            className="flex-1"
            onClick={requestWithdrawal}
            isLoading={isPending}
          >
            계속하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
