import CheckIcon from '@/shared/assets/_icons/button/check-icon.svg?react';
import { renderWithBr } from '@/shared/lib/renderWithBr';
import { Button } from '@/shared/ui/button/Button';
import Modal from '@/shared/ui/modal/compound-modal';

import { useLessonModal } from '../../model/use-lesson-modal-store';

export default function ReportResultModal() {
  const { isOpen, closeModal } = useLessonModal('result');

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="rounded-lg overflow-hidden  md:rounded-xl md:w-[467px]"
    >
      <Modal.Content className="p-4 md:p-8 bg-white md:bg-bg-1">
        <div className="flex flex-col items-center text-center py-5 md:py-10 mb-5 md:mb-10">
          <div className="p-4 bg-cta aspect-square rounded-full flex items-center justify-center mb-4 md:mb-8">
            <CheckIcon className="size-10 md:size-14" />
          </div>
          <h3 className="text-heading1 text-text-1 md:text-text-2 mb-1 md:mb-3">
            회원님의 신고가 <br className="md:hidden" /> 접수되었어요.
          </h3>
          <p className="text-label2 md:text-headline2 text-text-4 md:text-text-3-w">
            {renderWithBr([
              '회원님의 소중한 의견을 모아',
              '더욱 쾌적한 앱 환경을 만들겠습니다.',
              '단, 허위로 신고할 경우 제재 대상이 될 수 있어요.',
            ])}
          </p>
        </div>

        <Button
          type="button"
          size="custom"
          className="w-full h-12 md:h-[54px] text-headline2"
          onClick={closeModal}
        >
          확인
        </Button>
      </Modal.Content>
    </Modal>
  );
}
