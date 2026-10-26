import { Link } from '@tanstack/react-router';

import { useHistoryBackClick } from '@/shared/lib/use-history-back-click';
import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

import mascotImage from './assets/quit-mascot.webp';
import { QUIZ_EXIT_ROUTE } from './quiz-top-bar';

export interface QuizQuitModalProps {
  open: boolean;
  /** Esc, 바깥 클릭, 계속하기에서 false를 전달한다. */
  onOpenChange: (open: boolean) => void;
  /** 돌아갈 기록이 없을 때 이동할 유닛. */
  unitId: number;
  /** 없으면 챕터명 없이 본문을 표시한다. */
  chapterTitle?: string;
}

export function QuizQuitModal({ open, onOpenChange, unitId, chapterTitle }: QuizQuitModalProps) {
  const handleQuitClick = useHistoryBackClick();
  const learningSubject = chapterTitle ? `${chapterTitle} 학습` : '학습';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-8 bg-bg-0 p-4 md:max-w-[630px] md:rounded-12 md:bg-bg-1 md:p-8 md:shadow-elevation-1"
    >
      <div className="flex flex-col items-center gap-5 md:gap-10">
        <div className="flex flex-col items-center gap-4 py-5 md:gap-8 md:py-10">
          {/* 경고 문구가 내용을 전달하므로 마스코트는 장식 이미지로 둔다. */}
          <img src={mascotImage} alt="" width={211} height={239} className="w-37.5 md:w-[211px]" />
          <div className="flex flex-col items-center gap-1 text-center md:gap-3">
            <ModalTitle className="text-heading1 text-text-1 md:text-text-2">
              지금까지 푼 내역이
              <br />
              모두 사라져요!
            </ModalTitle>
            <ModalDescription className="text-label2 text-text-4 md:text-headline1">
              {learningSubject} 출제가 중단됩니다.
              <br />
              정말 학습을 그만두시나요?
            </ModalDescription>
          </div>
        </div>

        <div className="flex w-full gap-3 md:gap-4">
          {/* 탈퇴 확인 모달과 같은 색 조합을 쓰기 위해 배경과 글자색을 덮어쓴다. */}
          <Button
            asChild
            variant="stroke-secondary"
            size="cta"
            className="flex-1 bg-bg-0 text-main"
          >
            <Link
              to={QUIZ_EXIT_ROUTE}
              params={{ unitId: String(unitId) }}
              replace
              onClick={handleQuitClick}
            >
              그만두기
            </Link>
          </Button>
          <Button
            variant="default"
            size="cta"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            계속하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
