import { useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { getServerErrorMessage, useInterviewSessionStatus } from '@/entities/interview-session';
import { toast } from '@/shared/ui/toast';

const STATUS_ERROR_MESSAGE = '세션 정보를 불러오지 못했어요';
const GRADING_FAILED_MESSAGE = '채점에 실패했습니다';

/**
 * 세션 상태로 접근 가드를 수행한다(진행·확인 화면 공통). GET /status 는 상태와 무관하게 조회되므로,
 * 진입 시점에 상태를 확인해 IN_PROGRESS 만 통과시키고 그 외는 각자 목적지로 리다이렉트한다(questions 409 회피).
 */

export function useInterviewSessionGuard(sessionId: number): { isInProgress: boolean } {
  const navigate = useNavigate();
  const { data: status, isError, error } = useInterviewSessionStatus(sessionId);

  useEffect(() => {
    // 조회 실패: 진행할 수 없으니 안내 후 홈으로. 서버 메시지가 있으면 우선 사용한다.
    if (isError) {
      toast(getServerErrorMessage(error) ?? STATUS_ERROR_MESSAGE);
      navigate({ to: '/interview' });
      return;
    }

    // 로딩 중이거나 진행 중이면 통과.
    if (!status || status.status === 'IN_PROGRESS') {
      return;
    }

    switch (status.status) {
      case 'ABANDONED':
        navigate({ to: '/interview' });
        return;
      case 'GRADING':
        navigate({
          to: '/interview/sessions/grading/$sessionId',
          params: { sessionId: String(sessionId) },
          replace: true,
        });
        return;
      case 'COMPLETED':
        navigate({
          to: '/interview/history/$sessionId',
          params: { sessionId: String(sessionId) },
          search: { tab: 'summary' },
          replace: true,
        });
        return;
      case 'GRADING_FAILED':
        toast(GRADING_FAILED_MESSAGE);
        navigate({ to: '/interview' });
        return;
    }
  }, [status, isError, error, navigate, sessionId]);

  return { isInProgress: status?.status === 'IN_PROGRESS' };
}
