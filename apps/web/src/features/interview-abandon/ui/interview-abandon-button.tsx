import { useState } from 'react';

import { INTERVIEW_QUESTION_COUNT } from '@/entities/interview-session';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { IconButton } from '@/shared/ui/icon-button';

import { useAbandonInterview } from '../model/use-abandon-interview';
import { InterviewAbandonModal } from './interview-abandon-modal';

export function InterviewAbandonButton() {
  const isWideViewport = useIsWideViewport();
  const [isOpen, setIsOpen] = useState(false);
  const { abandon, isPending } = useAbandonInterview();

  return (
    <>
      <IconButton
        aria-label="인터뷰 그만두기"
        icon="home"
        iconSize={isWideViewport ? 32 : 24}
        onClick={() => setIsOpen(true)}
        className="bg-white size-12 md:size-15 md:rounded-full"
      />
      <InterviewAbandonModal
        open={isOpen}
        onOpenChange={setIsOpen}
        questionCount={INTERVIEW_QUESTION_COUNT}
        isPending={isPending}
        onConfirm={abandon}
      />
    </>
  );
}
