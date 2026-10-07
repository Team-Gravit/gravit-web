import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/generated/friend-api/friend-api';
import type { NotificationResponse } from '@/shared/api/generated/model';
import { useFollow } from '@/shared/api/generated/social-api/social-api';
import { getInboxQueryKey } from '@/entities/notification';

/**
 * 알림에서의 맞팔로우 mutation. 성공 시 **인박스 캐시의 actionType 을 직접 갱신**해(FOLLOW_BACK → NONE)
 * 팝오버 재오픈·페이지 재진입에도 상태가 유지되게 한다. 재조회는 하지 않는다(stale 표시만).
 */
export function useFollowFromNotification() {
  const queryClient = useQueryClient();

  return useFollow({
    mutation: {
      onSuccess: (_, { userId }) => {
        // 같은 actor 의 FOLLOW 알림을 '이미 팔로우 중'(NONE)으로 바꿔 팔로우 취소 버튼이 유지되게 한다.
        queryClient.setQueryData<NotificationResponse[]>(getInboxQueryKey(), (old) =>
          old?.map((item) =>
            item.type === 'FOLLOW' && item.actor?.profileId === userId
              ? { ...item, actionType: 'NONE' }
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
