import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { clearSession } from '@/entities/auth';

interface UseLogoutOptions {
  /** 세션과 캐시를 비운 뒤 호출된다. 이동 목적지는 호출부가 정한다. */
  onSuccess: () => void;
}

/**
 * 세션을 끝낸다. (기준선 E1)
 *
 * 캐시를 비우지 않으면 다음 사용자가 이전 사용자의 응답을 본다.
 * 이동 목적지는 정하지 않는다. 웹과 네이티브 셸에서 갈릴 수 있다.
 */
export function useLogout({ onSuccess }: UseLogoutOptions) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearSession();
    queryClient.clear();
    onSuccess();
  }, [onSuccess, queryClient]);
}
