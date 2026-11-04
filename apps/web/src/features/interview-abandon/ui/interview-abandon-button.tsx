import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { HomeIcon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { useInterviewSessionStore } from '@/entities/interview-session';

interface InterviewAbandonButtonProps {
  className?: string;
}

/**
 * 나가기 확인 모달을 '요청'하는 트리거 버튼. 모달과 확인 동작은 InterviewSessionBlocker가 단독 소유한다.
 * (홈 버튼·뒤로가기 두 경로가 같은 모달 하나를 공유해 중복 노출을 막는다.)
 */
export function InterviewAbandonButton({ className }: InterviewAbandonButtonProps) {
  const isWideViewport = useIsWideViewport();
  const requestLeave = useInterviewSessionStore((s) => s.requestLeave);

  return (
    <IconButton
      aria-label="인터뷰 그만두기"
      icon={HomeIcon}
      iconSize={isWideViewport ? 32 : 24}
      onClick={requestLeave}
      className={cn('bg-white size-12 md:size-15 md:rounded-full', className)}
    />
  );
}
