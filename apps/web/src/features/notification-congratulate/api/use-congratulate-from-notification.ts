import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import type { NotificationResponse, SocialFeedSliceResponse } from '@/shared/api/generated/model';
import { useCongratulateFeed } from '@/shared/api/generated/social-api/social-api';
import { toast } from '@/shared/ui/toast';
import { getFriendFeedQueryKey } from '@/entities/friend-feed';
import { getInboxQueryKey } from '@/entities/notification';

// 하루 축하 한도 초과 시 서버 에러코드(소셜 피드와 동일).
const LIMIT_EXCEEDED_ERROR = 'SOCIAL_4001';
const LIMIT_MESSAGE = '오늘 축하 횟수를 모두 사용했어요.';
const FAILURE_MESSAGE = '축하하기에 실패했어요. 잠시 후 다시 시도해주세요';

interface UseCongratulateFromNotificationProps {
  onSuccess?: () => void;
}

/**
 * 알림에서의 축하 mutation. 성공 시 인박스(targetId=feedId)와 소셜 피드(동일 feedId) 캐시를 모두
 * '축하 완료'로 직접 갱신한다(어느 쪽에서 눌러도 동기화). 재조회 대신 setQueryData 로 즉시 반영.
 */
export function useCongratulateFromNotification({
  onSuccess,
}: UseCongratulateFromNotificationProps = {}) {
  const queryClient = useQueryClient();

  return useCongratulateFeed({
    mutation: {
      onSuccess: (_, { feedId }) => {
        onSuccess?.();

        // 1) 인박스: 같은 feedId 를 가리키는(targetId) 항목을 축하 완료로.
        queryClient.setQueryData<NotificationResponse[]>(getInboxQueryKey(), (old) =>
          old?.map((item) => (item.targetId === feedId ? { ...item, congratulated: true } : item)),
        );

        // 2) 소셜 피드: 동일 feedId 항목을 축하 완료로(피드 재진입 시 일치).
        queryClient.setQueryData<InfiniteData<SocialFeedSliceResponse>>(
          getFriendFeedQueryKey(),
          (old) => {
            if (!old) {
              return old;
            }
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents.map((feed) =>
                  feed.feedId === feedId
                    ? { ...feed, congratulated: true, canCongratulate: false }
                    : feed,
                ),
              })),
            };
          },
        );

        queryClient.invalidateQueries({ queryKey: getInboxQueryKey(), refetchType: 'none' });
        queryClient.invalidateQueries({ queryKey: getFriendFeedQueryKey(), refetchType: 'none' });
      },
      onError: (error) => {
        const data = error.response?.data;
        if (data?.error !== LIMIT_EXCEEDED_ERROR) {
          toast(FAILURE_MESSAGE);
          return;
        }
        toast(typeof data.message === 'string' ? data.message : LIMIT_MESSAGE);
      },
    },
  });
}
