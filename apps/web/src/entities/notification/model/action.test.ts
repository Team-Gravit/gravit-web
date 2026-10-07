import { describe, expect, it } from 'vitest';

import { getActionDescriptor } from './action';
import type { Notification } from './types';

function noti(overrides: Partial<Notification>): Notification {
  return {
    id: 1,
    type: 'NOTICE',
    message: '메시지',
    actionType: 'NONE',
    read: false,
    createdAt: '2026-05-22T10:00:00',
    timeAgo: '2시간 전',
    ...overrides,
  };
}

describe('getActionDescriptor', () => {
  it('GO_TO_LEARNING 이면 /learning 링크를 반환한다', () => {
    expect(getActionDescriptor(noti({ type: 'INACTIVITY', actionType: 'GO_TO_LEARNING' }))).toEqual(
      {
        kind: 'link',
        label: '학습하러 가기',
        to: '/learning',
      },
    );
  });

  it('GO_TO_NOTICE / GO_TO_INQUIRY 의 경로가 각각 맞다', () => {
    expect(getActionDescriptor(noti({ actionType: 'GO_TO_NOTICE' }))).toMatchObject({
      to: '/settings/notice',
    });
    expect(getActionDescriptor(noti({ actionType: 'GO_TO_INQUIRY' }))).toMatchObject({
      to: '/settings/inquiry',
    });
  });

  it('비-FOLLOW 타입의 NONE 은 버튼 없음(none)이다', () => {
    expect(getActionDescriptor(noti({ type: 'NOTICE', actionType: 'NONE' }))).toEqual({
      kind: 'none',
    });
  });

  const actor = { profileId: 5, nickname: '김나영', profileImgNumber: 1 };

  it('FOLLOW_BACK 은 actor.profileId 를 담은 미팔로우 토글(follow)이다', () => {
    expect(getActionDescriptor(noti({ type: 'FOLLOW', actionType: 'FOLLOW_BACK', actor }))).toEqual(
      { kind: 'follow', userId: 5, initiallyFollowing: false },
    );
  });

  it('FOLLOW 타입의 NONE 은 이미 팔로우 토글(follow, initiallyFollowing=true)이다', () => {
    expect(getActionDescriptor(noti({ type: 'FOLLOW', actionType: 'NONE', actor }))).toEqual({
      kind: 'follow',
      userId: 5,
      initiallyFollowing: true,
    });
  });

  it('FOLLOW_BACK 이라도 actor 가 없으면 none 이다', () => {
    expect(getActionDescriptor(noti({ type: 'FOLLOW', actionType: 'FOLLOW_BACK' }))).toEqual({
      kind: 'none',
    });
  });

  it('CONGRATULATE 는 targetId=feedId 와 congratulated 를 담은 congratulate 이다', () => {
    expect(
      getActionDescriptor(
        noti({
          type: 'FRIEND_ACTIVITY',
          actionType: 'CONGRATULATE',
          targetId: 77,
          congratulated: false,
        }),
      ),
    ).toEqual({ kind: 'congratulate', feedId: 77, congratulated: false });
  });

  it('actionType 에 없는 값은 none 이다', () => {
    expect(getActionDescriptor(noti({ actionType: 'GO_TO_LEAGUE' }))).toEqual({ kind: 'none' });
  });
});
