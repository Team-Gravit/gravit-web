import { useRouter } from '@tanstack/react-router';

import MascotSad from '@/shared/assets/_images/mascot-sad.png';
import { Button } from '@/shared/ui/button/Button';
import Modal from '@/shared/ui/modal/compound-modal';

import { useLessonModal } from '../../model/use-lesson-modal-store';

export const LessonQuitModal = () => {
  const { isOpen, closeModal } = useLessonModal('quit');
  const router = useRouter();

  const onHandleQuit = () => {
    closeModal();
    router.history.back();
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Modal.Content className="md:p-8">
        <div className="py-5 md:py-10 text-center mb-5 md:mb-10">
          <img
            src={MascotSad}
            alt="울고있는 마스코트 이미지"
            className="w-[150px] md:w-[210px] h-[160px] md:h-[240px] mx-auto mb-4 md:mb-8"
          />
          <h3 className="text-heading1 text-text-1 md:text-text-2 mb-1 md:mb-3">
            지금까지 푼 내역이
            <br />
            모두 사라져요!
          </h3>

          <p className="text-label2 md:text-headline1 text-text-4 md:text-text-3-w">
            자료구조 학습 출제가 중단됩니다.
            <br />
            정말 학습을 그만두시나요?
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant={'strokeGray'}
            onClick={onHandleQuit}
            size="custom"
            className="w-full h-12 md:h-[54px] text-main-1 text-headline2 bg-white"
          >
            그만두기
          </Button>
          <Button
            size="custom"
            onClick={closeModal}
            className="w-full h-12 md:h-[54px] text-headline2"
          >
            계속하기
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};
