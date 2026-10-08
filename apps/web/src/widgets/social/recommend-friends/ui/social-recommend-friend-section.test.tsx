import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { SocialRecommendFriendSection } from './social-recommend-friend-section';

// Radix ScrollArea 가 ResizeObserver 를 쓰는데 jsdom 에는 없다. 테스트 대상이 아니므로 no-op 로 stub 한다.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const RECOMMEND_URL = '*/api/v1/social/recommend';
const FOLLOW_URL = '*/api/v1/social/follow/1';
const UNFOLLOW_URL = '*/api/v1/friends/unfollowing/1';
const COUNT_URL = '*/api/v1/friends/count';

const RECOMMENDED = [{ userId: 1, nickname: '규빈', profileImgNumber: 1, mutualFollowCount: 3 }];

function mockBase() {
  server.use(
    http.get(RECOMMEND_URL, () => HttpResponse.json(RECOMMENDED)),
    http.get(COUNT_URL, () => HttpResponse.json({ followerCount: 0, followingCount: 0 })),
  );
}

describe('SocialRecommendFriendSection', () => {
  it('팔로우하면 카드는 유지되고 버튼이 「팔로우 취소」로 바뀐다 (AC-1)', async () => {
    mockBase();
    server.use(http.post(FOLLOW_URL, () => new HttpResponse(null, { status: 200 })));
    await renderWithProviders(SocialRecommendFriendSection);

    await screen.findByText('규빈');
    await userEvent.click(screen.getAllByRole('button', { name: '팔로우' })[0]);

    expect(await screen.findByRole('button', { name: '팔로우 취소' })).toBeInTheDocument();
    expect(screen.getByText('규빈')).toBeInTheDocument();
  });

  it('언팔로우하면 카드는 유지되고 버튼이 다시 「팔로우」로 바뀐다 (AC-2)', async () => {
    mockBase();
    server.use(
      http.post(FOLLOW_URL, () => new HttpResponse(null, { status: 200 })),
      http.post(UNFOLLOW_URL, () => new HttpResponse(null, { status: 200 })),
    );
    await renderWithProviders(SocialRecommendFriendSection);

    await screen.findByText('규빈');
    await userEvent.click(screen.getAllByRole('button', { name: '팔로우' })[0]);
    await userEvent.click(await screen.findByRole('button', { name: '팔로우 취소' }));

    expect(await screen.findAllByRole('button', { name: '팔로우' })).not.toHaveLength(0);
    expect(screen.getByText('규빈')).toBeInTheDocument();
  });
});
