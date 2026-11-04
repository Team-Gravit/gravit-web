import { useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { toast } from '@/shared/ui/toast';
import {
  getGradingErrorMessage,
  resolveInterviewTransition,
  useInterviewSessionStatus,
} from '@/entities/interview-session';
import { InterviewGradingExitButton } from '@/features/interview-grading-exit';
import { GradingFallback } from '@/widgets/interview-session';

interface InterviewGradingPageProps {
  sessionId: number;
}

/**
 * 제출 후 채점 대기 페이지. 세션 상태를 폴링하며 채점 중에는 폴백을 보여주고,
 * 채점이 완료되면 리포트로, 실패하면 안내 후 홈으로 보낸다.
 */
export function InterviewGradingPage({ sessionId }: InterviewGradingPageProps) {
  const navigate = useNavigate();
  const { data, isError, error } = useInterviewSessionStatus(sessionId, {
    refetchWhileGrading: true,
  });
  const status = data?.status;

  // 폴링 결과(상태·에러)에 따라 이동·안내를 실행한다. 판단은 순수하게, 실행만 effect에서 한다.
  // data?.status·isError 가 바뀔 때만 재실행되어 폴링 리렌더에서 토스트·이동이 중복되지 않는다.
  useEffect(() => {
    if (isError) {
      toast(getGradingErrorMessage(error));
      navigate({ to: '/interview', replace: true });
      return;
    }
    if (!status || status === 'GRADING') {
      return;
    }

    if (status === 'IN_PROGRESS') {
      navigate({
        to: '/interview/sessions/$sessionId',
        params: { sessionId: String(sessionId) },
        replace: true,
      });
      return;
    }

    const transition = resolveInterviewTransition(status, sessionId);
    if (transition) {
      if (transition.toast) toast(transition.toast);
      navigate(transition.navigate);
    }
  }, [status, isError, error, navigate, sessionId]);

  // 채점 완료 전(IN_PROGRESS/GRADING)·전환 대기 중에는 폴백을 보여준다.
  return (
    <>
      <header className="hidden md:flex z-30 fixed w-full h-[72px] shrink-0 items-center border-b border-divider-1 bg-bg-0/20 px-5">
        <InterviewGradingExitButton className="bg-bg-0/20" />
      </header>
      <GradingFallback />
    </>
  );
}
