import { QueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/entities/auth';

import { shouldRetryQuery } from './query-retry';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // 조회에만 재시도 정책을 적용한다. 변경 요청은 기본 설정대로 재시도하지 않는다.
      retry: shouldRetryQuery,
    },
  },
});

// 재발급 실패처럼 로그아웃 버튼을 거치지 않고 세션이 끝나도 다음 사용자가 이전 사용자의 응답을 보지 않게 한다.
// 재발급으로 토큰만 바뀔 때는 비우지 않는다.
useAuthStore.subscribe((state, previousState) => {
  if (previousState.accessToken !== null && state.accessToken === null) {
    queryClient.clear();
  }
});
