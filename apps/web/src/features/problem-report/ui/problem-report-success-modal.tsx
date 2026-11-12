import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

import ReportSuccessCheck from './assets/report-success-check.svg?react';

export interface ProblemReportSuccessModalProps {
  open: boolean;
  /** 확인, Esc, 바깥 클릭에서 false를 전달한다. */
  onOpenChange: (open: boolean) => void;
}

export function ProblemReportSuccessModal({ open, onOpenChange }: ProblemReportSuccessModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-8 bg-bg-0 p-4 md:max-w-[467px] md:rounded-12 md:bg-bg-1 md:p-8"
    >
      <div className="flex flex-col items-center gap-5 md:gap-10">
        <div className="flex flex-col items-center gap-4 py-5 md:gap-8 md:p-10">
          <ReportSuccessCheck aria-hidden className="size-[70px] md:size-[106px]" />
          <div className="flex flex-col items-center gap-1 text-center md:gap-3">
            <ModalTitle className="text-heading1 text-text-1 md:text-text-2">
              회원님의 신고가
              <br className="md:hidden" /> 접수되었어요.
            </ModalTitle>
            <ModalDescription className="text-label2 text-text-4 md:text-headline1 md:text-text-3-w">
              회원님의 소중한 의견들을 모아
              <br />
              더욱 쾌적한 앱 환경을 만들겠습니다.
              <br />
              단, 허위로 신고할 경우 제재 대상이 될 수 있어요.
            </ModalDescription>
          </div>
        </div>

        <Button size="cta" onClick={() => onOpenChange(false)}>
          확인
        </Button>
      </div>
    </Modal>
  );
}
