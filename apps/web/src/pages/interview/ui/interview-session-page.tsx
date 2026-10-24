import { useNavigate, useParams } from '@tanstack/react-router';

import { InterviewSession } from '@/widgets/interview-session';

import { useInterviewSessionGuard } from '../lib/use-interview-session-guard';

export function InterviewSessionPage() {
  const { sessionId } = useParams({ from: '/_authenticated/_focus/interview/sessions/$sessionId' });
  const navigate = useNavigate();
  // 진행 중 세션만 문항을 조회할 수 있어, 진입 시 상태로 접근을 가드한다(취소→홈, 제출됨→리포트/채점대기).
  const { isInProgress } = useInterviewSessionGuard(Number(sessionId));

  // 진행 중 세션만 렌더한다. 그 외(로딩 중·취소·제출됨·에러)는 가드가 적절히 리다이렉트한다.
  if (!isInProgress) {
    return null;
  }

  return (
    <InterviewSession
      sessionId={Number(sessionId)}
      onComplete={() =>
        navigate({ to: '/interview/sessions/confirm/$sessionId', params: { sessionId } })
      }
    />
  );
}
