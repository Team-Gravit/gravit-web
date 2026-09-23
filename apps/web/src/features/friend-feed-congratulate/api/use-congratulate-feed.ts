import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import { getFriendFeedQueryKey } from '@/entities/friend-feed';
import type { SocialFeedSliceResponse } from '@/shared/api/generated/model';
import { useCongratulateFeed } from '@/shared/api/generated/social-api/social-api';
import { toast } from '@/shared/ui/toast';

// 하루 축하 한도 초과 시 서버가 주는 에러코드. 이 코드일 때만 한도 안내를 띄운다.
const LIMIT_EXCEEDED_ERROR = 'SOCIAL_4001';
const LIMIT_MESSAGE = '오늘 축하 횟수를 모두 사용했어요.';
const FAILURE_MESSAGE = '축하하기에 실패했어요. 잠시 후 다시 시도해주세요';

/** 피드 축하하기 mutation. 성공 시 해당 피드 항목만 축하 완료로 갱신한다(전체 refetch 없이). */
export function useCongratulate() {
  const queryClient = useQueryClient();

  return useCongratulateFeed({
    mutation: {
      onSuccess: (_, { feedId }) => {
        // 축하 응답이 void 라 갱신 상태를 서버가 주지 않는다.
        // 1) 축하한 피드 항목만 캐시에서 직접 '축하 완료'로 바꿔 그 줄만 즉시 반영한다.
        //    (무한쿼리 전체 무효화는 로드된 모든 페이지를 한꺼번에 refetch 시키므로 피한다.)
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

        // 2) 하루 3회 제한 등 canCongratulate 는 서버가 계산한다. stale 로만 표시해
        //    다음에 피드를 다시 열 때 서버의 정확한 상태를 받아오게 한다(지금 즉시 refetch 하지 않음).
        queryClient.invalidateQueries({
          queryKey: getFriendFeedQueryKey(),
          refetchType: 'none',
        });
      },
      onError: (error, { feedId }) => {
        const data = error.response?.data;
        if (data?.error !== LIMIT_EXCEEDED_ERROR) {
          toast(FAILURE_MESSAGE);
          return;
        }

        // 한도 초과 = 이 인물은 오늘 더 축하할 수 없다는 서버 확정. 같은 인물의 다른 피드 항목도
        // canCongratulate=false 로 반영해 즉시 비활성화한다(누른 항목의 actorId 로 캐시에서 묶는다).
        queryClient.setQueryData<InfiniteData<SocialFeedSliceResponse>>(
          getFriendFeedQueryKey(),
          (old) => {
            if (!old) {
              return old;
            }
            const actorId = old.pages
              .flatMap((page) => page.contents)
              .find((feed) => feed.feedId === feedId)?.actorId;
            if (actorId === undefined) {
              return old;
            }
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents.map((feed) =>
                  feed.actorId === actorId ? { ...feed, canCongratulate: false } : feed,
                ),
              })),
            };
          },
        );

        // 서버 메시지를 우선 노출(카피의 SoT), 형식이 어긋나면 상수로 대체한다.
        toast(typeof data.message === 'string' ? data.message : LIMIT_MESSAGE);
      },
    },
  });
}
