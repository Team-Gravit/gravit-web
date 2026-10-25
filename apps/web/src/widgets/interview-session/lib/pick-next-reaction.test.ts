import { describe, it, expect } from 'vitest';

import { pickNextReaction } from './pick-next-reaction';

describe('pickNextReaction', () => {
  it('직전이 worry 면 worry 를 다시 고르지 않는다', () => {
    // 후보는 listen·memo 뿐이라 random 이 1 에 근접해도 worry 가 나올 수 없다.
    for (let r = 0; r < 1; r += 0.05) {
      expect(pickNextReaction('worry', () => r)).not.toBe('worry');
    }
  });

  it('random 이 0 이면 첫 후보 listen 을 고른다', () => {
    expect(pickNextReaction(null, () => 0)).toBe('listen');
  });

  it('memo 구간(40~75)을 고른다', () => {
    // threshold = 0.5 * 100 = 50 → listen(40) 소진 후 memo 에서 음수가 된다.
    expect(pickNextReaction('listen', () => 0.5)).toBe('memo');
  });

  it('직전이 worry 가 아니고 random 이 1 에 근접하면 worry 를 고른다', () => {
    // threshold = 0.9 * 100 = 90 → listen+memo(75) 소진 후 worry 에서 음수가 된다.
    expect(pickNextReaction('listen', () => 0.9)).toBe('worry');
  });
});
