import { useQueryClient } from '@tanstack/react-query';

/**
 * 지금 화면에 붙어 있는 쿼리를 모두 다시 불러오는 함수를 돌려준다.
 * 하나라도 실패하면 거부한다. 기본 동작은 실패해도 resolve해서 호출자가 알 수 없다.
 */
export function useRefetchActiveQueries(): () => Promise<void> {
  const queryClient = useQueryClient();

  return () => queryClient.refetchQueries({ type: 'active' }, { throwOnError: true });
}
