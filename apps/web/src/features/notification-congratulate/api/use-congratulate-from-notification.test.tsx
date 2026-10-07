import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, type InfiniteData } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import type { NotificationResponse, SocialFeedSliceResponse } from '@/shared/api/generated/model';
import { getFriendFeedQueryKey } from '@/entities/friend-feed';
import { getInboxQueryKey } from '@/entities/notification';

import { useCongratulateFromNotification } from './use-congratulate-from-notification';

function createWrapper(queryClient: QueryClient) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe('useCongratulateFromNotification', () => {
  it('축하 성공 시 인박스와 소셜 피드 캐시가 모두 축하 완료로 동기화된다 (AC-2)', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    queryClient.setQueryData<NotificationResponse[]>(getInboxQueryKey(), [
      {
        id: 6,
        type: 'FRIEND_ACTIVITY',
        message: '강도현님이 활동했어요.',
        actionType: 'CONGRATULATE',
        targetId: 77,
        congratulated: false,
        read: false,
        createdAt: '2026-05-22T10:00:00Z',
        timeAgo: '어제',
      },
    ]);
    queryClient.setQueryData<InfiniteData<SocialFeedSliceResponse>>(getFriendFeedQueryKey(), {
      pageParams: [undefined],
      pages: [
        {
          hasNextPage: false,
          contents: [{ feedId: 77, congratulated: false, canCongratulate: true }],
        } as SocialFeedSliceResponse,
      ],
    });

    server.use(
      http.post(
        '*/api/v1/social/feed/77/congratulate',
        () => new HttpResponse(null, { status: 200 }),
      ),
    );

    const { result } = renderHook(() => useCongratulateFromNotification(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ feedId: 77 });

    await waitFor(() => {
      const inbox = queryClient.getQueryData<NotificationResponse[]>(getInboxQueryKey());
      expect(inbox?.[0].congratulated).toBe(true);
    });

    const feed =
      queryClient.getQueryData<InfiniteData<SocialFeedSliceResponse>>(getFriendFeedQueryKey());
    expect(feed?.pages[0].contents[0].congratulated).toBe(true);
    expect(feed?.pages[0].contents[0].canCongratulate).toBe(false);
  });
});
