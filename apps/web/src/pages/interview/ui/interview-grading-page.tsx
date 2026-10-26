import { useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { useInterviewSessionStatus } from '@/entities/interview-session';
import { toast } from '@/shared/ui/toast';
import { GradingFallback } from '@/widgets/interview-session';

const GRADING_FAILED_MESSAGE = '채점에 실패했습니다';

interface InterviewGradingPageProps {
  sessionId: number;
}

/**
 * 제출 후 채점 대기 페이지. 세션 상태를 폴링하며 채점 중에는 폴백을 보여주고,
 * 채점이 완료되면 리포트로, 실패하면 안내 후 홈으로 보낸다.
 */
export function InterviewGradingPage({ sessionId }: InterviewGradingPageProps) {
  const navigate = useNavigate();
  const { data } = useInterviewSessionStatus(sessionId, { refetchWhileGrading: true });

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      navigate({
        to: '/interview/history/$sessionId',
        params: { sessionId: String(sessionId) },
        search: { tab: 'summary' },
        replace: true,
      });
      return;
    }

    // 채점 실패 후속 화면은 아직 없어 임시로 안내 후 홈으로 보낸다.
    if (data?.status === 'GRADING_FAILED') {
      toast(GRADING_FAILED_MESSAGE);
      navigate({ to: '/interview' });
    }
  }, [data?.status, navigate, sessionId]);

  // 채점 완료 전(IN_PROGRESS/GRADING)에는 폴백을 보여준다.
  return <GradingFallback />;
}
