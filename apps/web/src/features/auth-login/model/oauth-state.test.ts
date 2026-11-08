import { beforeEach, describe, expect, it } from 'vitest';

import {
  OAUTH_STATE_TTL_MS,
  consumePendingOauthState,
  isPendingStateMatched,
  savePendingOauthState,
  type PendingOauthState,
} from './oauth-state';

const NOW = 1_000_000;
const PENDING: PendingOauthState = { provider: 'google', state: 'st_1', createdAt: NOW };

describe('isPendingStateMatched', () => {
  it('제공자와 state 가 같고 만료 전이면 true 다', () => {
    expect(isPendingStateMatched(PENDING, { provider: 'google', state: 'st_1' }, NOW)).toBe(true);
  });

  it('정확히 10분이 지난 시점까지는 true 다', () => {
    const now = NOW + OAUTH_STATE_TTL_MS;

    expect(isPendingStateMatched(PENDING, { provider: 'google', state: 'st_1' }, now)).toBe(true);
  });

  it.each([
    ['저장값이 없으면', null, { provider: 'google', state: 'st_1' }, NOW],
    ['콜백 state 가 없으면', PENDING, { provider: 'google', state: undefined }, NOW],
    ['state 가 다르면', PENDING, { provider: 'google', state: 'st_2' }, NOW],
    ['제공자가 다르면', PENDING, { provider: 'kakao', state: 'st_1' }, NOW],
    [
      '10분이 넘게 지났으면',
      PENDING,
      { provider: 'google', state: 'st_1' },
      NOW + OAUTH_STATE_TTL_MS + 1,
    ],
  ] as const)('%s false 다', (_, pending, callback, now) => {
    expect(isPendingStateMatched(pending, callback, now)).toBe(false);
  });
});

describe('consumePendingOauthState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장한 값과 같으면 true 이고 저장값을 지운다', () => {
    savePendingOauthState('naver', 'st_1');

    expect(consumePendingOauthState({ provider: 'naver', state: 'st_1' })).toBe(true);
    expect(consumePendingOauthState({ provider: 'naver', state: 'st_1' })).toBe(false);
  });

  it('다르면 false 이고 저장값을 지운다', () => {
    savePendingOauthState('naver', 'st_1');

    expect(consumePendingOauthState({ provider: 'naver', state: 'st_2' })).toBe(false);
    expect(localStorage.length).toBe(0);
  });

  it('저장값이 손상돼 있으면 false 다', () => {
    localStorage.setItem('pendingOauthState', '{broken');

    expect(consumePendingOauthState({ provider: 'naver', state: 'st_1' })).toBe(false);
  });
});
