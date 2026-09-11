import { describe, expect, it } from 'vitest';

import { getLevelInfo } from './level-table';

describe('getLevelInfo', () => {
  it('구간 시작 xp면 progress가 0이다', () => {
    expect(getLevelInfo(100)).toMatchObject({ level: 2, progress: 0 });
  });

  it('구간 중간 xp면 progress가 비율로 나온다', () => {
    // level 2: 100~199, 중간값 150 → (150-100)/(199-100) ≈ 0.505
    expect(getLevelInfo(150).progress).toBeCloseTo(50 / 99);
  });

  it('마지막 구간(endXp Infinity)은 progress가 1이다', () => {
    expect(getLevelInfo(999999)).toMatchObject({ level: 10, progress: 1 });
  });
});
