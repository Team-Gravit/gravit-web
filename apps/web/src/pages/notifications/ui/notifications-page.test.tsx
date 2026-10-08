import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { NotificationsPage } from './notifications-page';

const INBOX_URL = '*/api/v1/notifications';
const EXTRA_PATHS = ['/my', '/learning', '/notifications'];

const followItem = (actionType: string) => ({
  id: 1,
  type: 'FOLLOW',
  message: '친구신청을 보냈어요.',
  actionType,
  actor: { profileId: 5, nickname: '김나영', profileImgNumber: 1 },
  read: false,
  createdAt: '2026-05-22T10:00:00',
  timeAgo: '2시간 전',
});

describe('NotificationsPage', () => {
  it('날짜 그룹 헤더 + 알림 카드 + 이동 액션을 렌더한다 (Issue2 AC-3)', async () => {
    server.use(
      http.get(INBOX_URL, () =>
        HttpResponse.json([
          {
            id: 2,
            type: 'INACTIVITY',
            message: '연속학습이 깨져요.',
            subText: '다음날까지 2시간 남았어요.',
            actionType: 'GO_TO_LEARNING',
            read: false,
            createdAt: '2026-05-22T10:00:00',
            timeAgo: '2시간 전',
          },
        ]),
      ),
    );

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    // 데이터 의존 요소(카드)를 먼저 기다린다. 헤딩은 정적이라 데이터 로드 전에도 떠서 기준이 안 된다.
    expect(await screen.findByText('연속학습이 깨져요.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '알림' })).toBeInTheDocument();
    expect(screen.getByText('2026. 05. 22 (금)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '학습하러 가기' })).toHaveAttribute(
      'href',
      '/learning',
    );
  });
});

describe('NotificationsPage - FOLLOW 토글', () => {
  it('맞팔로우 클릭 시 버튼이 「팔로우 취소」로 바뀐다 (Issue3 AC-1)', async () => {
    server.use(
      http.get(INBOX_URL, () => HttpResponse.json([followItem('FOLLOW_BACK')])),
      http.post('*/api/v1/social/follow/5', () => new HttpResponse(null, { status: 200 })),
    );

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    await userEvent.click(await screen.findByRole('button', { name: '맞팔로우' }));

    expect(await screen.findByRole('button', { name: '팔로우 취소' })).toBeInTheDocument();
  });

  it('팔로우 취소 클릭 시 「맞팔로우」로 돌아오고 인박스 refetch 는 없다 (Issue3 AC-2)', async () => {
    let inboxRequests = 0;
    server.use(
      http.get(INBOX_URL, () => {
        inboxRequests += 1;
        return HttpResponse.json([followItem('FOLLOW_BACK')]);
      }),
      http.post('*/api/v1/social/follow/5', () => new HttpResponse(null, { status: 200 })),
      http.post('*/api/v1/friends/unfollowing/5', () => new HttpResponse(null, { status: 200 })),
    );

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    await userEvent.click(await screen.findByRole('button', { name: '맞팔로우' }));
    await userEvent.click(await screen.findByRole('button', { name: '팔로우 취소' }));

    expect(await screen.findByRole('button', { name: '맞팔로우' })).toBeInTheDocument();
    expect(inboxRequests).toBe(1);
  });

  it('이미 팔로우 중(actionType NONE)이면 「팔로우 취소」로 표시된다 (Issue3 AC-3)', async () => {
    server.use(http.get(INBOX_URL, () => HttpResponse.json([followItem('NONE')])));

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    expect(await screen.findByRole('button', { name: '팔로우 취소' })).toBeInTheDocument();
  });
});

describe('NotificationsPage - 축하', () => {
  const congratulateItem = (congratulated: boolean) => ({
    id: 6,
    type: 'FRIEND_ACTIVITY',
    message: '강도현님이 활동했어요.',
    subText: '자료구조 챕터를 완료했어요.',
    actionType: 'CONGRATULATE',
    targetId: 77,
    congratulated,
    read: false,
    createdAt: '2026-05-22T10:00:00',
    timeAgo: '어제',
  });

  it('축하하기 클릭 시 「축하 완료」로 바뀐다 (Issue4 AC-1)', async () => {
    server.use(
      http.get(INBOX_URL, () => HttpResponse.json([congratulateItem(false)])),
      http.post(
        '*/api/v1/social/feed/77/congratulate',
        () => new HttpResponse(null, { status: 200 }),
      ),
    );

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    await userEvent.click(await screen.findByRole('button', { name: '축하하기' }));

    expect(await screen.findByRole('button', { name: '축하 완료' })).toBeInTheDocument();
  });

  it('이미 축하한 알림은 「축하 완료」 비활성으로 표시된다 (Issue4 AC-3)', async () => {
    server.use(http.get(INBOX_URL, () => HttpResponse.json([congratulateItem(true)])));

    await renderWithProviders(NotificationsPage, { extraPaths: EXTRA_PATHS });

    expect(await screen.findByRole('button', { name: '축하 완료' })).toBeDisabled();
  });
});
