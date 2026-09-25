import { describe, expect, it } from 'vitest';

import { getLevelInfo, toLevelProgress } from './level';

describe('getLevelInfo', () => {
  it('구간 시작 xp면 progress가 0이다', () => {
    expect(getLevelInfo(100)).toMatchObject({ level: 2, progress: 0 });
  });

  it('구간 중간 xp면 progress가 비율로 나온다', () => {
    // 2레벨 구간에서 150XP의 진행률은 50 / 99다.
    expect(getLevelInfo(150).progress).toBeCloseTo(50 / 99);
  });

  it('마지막 구간(endXp Infinity)은 progress가 1이다', () => {
    expect(getLevelInfo(999999)).toMatchObject({ level: 10, progress: 1 });
  });
});

describe('toLevelProgress', () => {
  it('구간 안의 XP 를 정수 퍼센트로 바꾼다', () => {
    const progress = toLevelProgress({
      currentLevel: 13,
      nextLevel: 14,
      xp: 789,
      minXp: 700,
      maxXp: 900,
    });

    // 789XP는 구간의 44.5%이므로 45%로 반올림한다.
    expect(progress).toEqual({ percent: 45, currentXp: 789, nextLevel: 14 });
  });

  it('최고 레벨이면 분모가 0이라도 100을 반환한다', () => {
    const progress = toLevelProgress({
      currentLevel: 30,
      nextLevel: 30,
      xp: 5000,
      minXp: 5000,
      maxXp: 5000,
    });

    expect(progress.percent).toBe(100);
  });

  it('구간을 벗어난 XP 는 0~100 으로 보정한다', () => {
    expect(
      toLevelProgress({ currentLevel: 1, nextLevel: 2, xp: 50, minXp: 100, maxXp: 200 }).percent,
    ).toBe(0);
    expect(
      toLevelProgress({ currentLevel: 1, nextLevel: 2, xp: 500, minXp: 100, maxXp: 200 }).percent,
    ).toBe(100);
  });
});
