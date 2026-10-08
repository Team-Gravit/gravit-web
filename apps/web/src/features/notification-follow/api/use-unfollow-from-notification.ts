import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useUnfollow,
} from '@/shared/api/generated/friend-api/friend-api';
import type { NotificationResponse } from '@/shared/api/generated/model';
import { getInboxQueryKey } from '@/entities/notification';

/**
 * 알림에서의 팔로우 취소 mutation. 성공 시 **인박스 캐시의 actionType 을 직접 갱신**해(NONE → FOLLOW_BACK)
 * 팝오버 재오픈·페이지 재진입에도 상태가 유지되게 한다. 재조회는 하지 않는다(stale 표시만).
 */
export function useUnfollowFromNotification() {
  const queryClient = useQueryClient();

  return useUnfollow({
    mutation: {
      onSuccess: (_, { followeeId }) => {
        // 같은 actor 의 FOLLOW 알림을 '미팔로우'(FOLLOW_BACK)로 바꿔 맞팔로우 버튼이 유지되게 한다.
        queryClient.setQueryData<NotificationResponse[]>(getInboxQueryKey(), (old) =>
          old?.map((item) =>
            item.type === 'FOLLOW' && item.actor?.profileId === followeeId
              ? { ...item, actionType: 'FOLLOW_BACK' }
              : item,
          ),
        );

        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
          refetchType: 'none',
        });
        queryClient.invalidateQueries({ queryKey: getInboxQueryKey(), refetchType: 'none' });
      },
    },
  });
}
