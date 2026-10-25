import { useEffect } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';

import { useInterviewSessionStore } from '@/entities/interview-session';
import { InterviewSession } from '@/widgets/interview-session';

import { useInterviewSessionGuard } from '../lib/use-interview-session-guard';

export function InterviewSessionPage() {
  const { sessionId } = useParams({ from: '/_authenticated/_focus/interview/sessions/$sessionId' });
  const navigate = useNavigate();
  // 진행 중 세션만 문항을 조회할 수 있어, 진입 시 상태로 접근을 가드한다(취소→홈, 제출됨→리포트/채점대기).
  const { isInProgress } = useInterviewSessionGuard(Number(sessionId));
  const storeSessionId = useInterviewSessionStore((s) => s.sessionId);

  // 이탈(탭 닫기 등)로 sessionStorage의 세션 정보가 사라진 뒤 재진입하면 세션을 재개하지 않고
  // 생성 페이지로 보낸다. 정상 진입은 세션 생성 시 enterSession으로 store에 기록돼 있다.
  const isAbandonedReentry = isInProgress && storeSessionId !== Number(sessionId);

  useEffect(() => {
    if (isAbandonedReentry) {
      navigate({ to: '/interview/new/$step', params: { step: 'answer-type' } });
    }
  }, [isAbandonedReentry, navigate]);

  // 진행 중 + 정상 진입만 렌더한다. 그 외(로딩 중·취소·제출됨·에러·이탈 재진입)는 리다이렉트된다.
  if (!isInProgress || isAbandonedReentry) {
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
