import { useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';

import {
  isAllTranscriptionsTerminal,
  isSessionCompleted,
  useInterviewQuestions,
  useInterviewSessionStore,
  useInterviewTranscriptions,
} from '@/entities/interview-session';
import { MascotLoading } from '@/shared/ui/mascot-loading';
import { InterviewConfirm } from '@/widgets/interview-session';

import { useInterviewSessionGuard } from '../lib/use-interview-session-guard';

interface InterviewConfirmPageProps {
  sessionId: number;
}

/**
 * 답변 확인 페이지. 진입 자격(세션 상태·문항 완료)을 가드한 뒤, 음성은 STT 변환을 폴링하고
 * 전부 종료되면 확인/수정 화면을 보여준다.
 */
export function InterviewConfirmPage({ sessionId }: InterviewConfirmPageProps) {
  const navigate = useNavigate();
  const { isInProgress } = useInterviewSessionGuard(sessionId);

  const currentIndex = useInterviewSessionStore((s) => s.currentIndex);
  const { data: questions } = useInterviewQuestions(sessionId);
  const totalQuestions = questions?.questions.length;
  const isCompleted = totalQuestions != null && isSessionCompleted(currentIndex, totalQuestions);

  // 모든 문항을 끝내지 않은 채 확인 화면에 접근하면 진행 화면으로 돌려보낸다.
  useEffect(() => {
    if (isInProgress && totalQuestions != null && !isCompleted) {
      navigate({
        to: '/interview/sessions/$sessionId',
        params: { sessionId: String(sessionId) },
        replace: true,
      });
    }
  }, [isInProgress, totalQuestions, isCompleted, navigate, sessionId]);

  const isVoice = questions?.inputType === 'VOICE';
  const { data: transcriptions } = useInterviewTranscriptions(sessionId, {
    enabled: isInProgress && isCompleted && isVoice,
  });

  // 가드(IN_PROGRESS) + 완료 체크를 통과하기 전에는 렌더하지 않는다.
  if (!isInProgress || !isCompleted) {
    return null;
  }

  if (isVoice && !isAllTranscriptionsTerminal(transcriptions)) {
    return <MascotLoading className="h-svh bg-bg-1" message="답변을 텍스트로 바꾸고 있어요" />;
  }

  return (
    <InterviewConfirm
      sessionId={sessionId}
      onSubmitted={() =>
        navigate({
          to: '/interview/sessions/grading/$sessionId',
          params: { sessionId: String(sessionId) },
          // 제출 후 채점 대기 화면으로 교체 이동(뒤로가기로 confirm 재진입·재제출 방지).
          replace: true,
        })
      }
    />
  );
}
