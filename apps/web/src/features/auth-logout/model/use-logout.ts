import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getRefreshToken } from '@/shared/api';
import { clearSession } from '@/entities/auth';

import { revokeSession } from '../api/revoke-session';

interface UseLogoutOptions {
  /** 세션과 캐시를 비운 뒤 호출된다. 이동 목적지는 호출부가 정한다. */
  onSuccess: () => void;
}

/**
 * 세션을 끝낸다. (기준선 E1)
 *
 * 캐시를 비우지 않으면 다음 사용자가 이전 사용자의 응답을 본다.
 * 이 기기의 세션을 먼저 지운 뒤 서버 로그아웃을 요청한다. 요청이 실패해도 세션 힌트가 없어
 * 새로고침으로 세션이 되살아나지 않는다. (FEAT-080 ADR-5)
 * 이동 목적지는 정하지 않는다. 웹과 네이티브 셸에서 갈릴 수 있다.
 */
export function useLogout({ onSuccess }: UseLogoutOptions) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    // 앱은 저장소의 refreshToken을 본문에 실어야 한다. 지우기 전에 읽어 둔다. 웹은 null이다.
    const refreshToken = getRefreshToken();

    clearSession();
    queryClient.clear();
    onSuccess();
    revokeSession(refreshToken);
  }, [onSuccess, queryClient]);
}
