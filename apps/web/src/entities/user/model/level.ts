import type { UserLevelResponse } from '@/shared/api/generated/model';

export interface LevelRange {
  level: number;
  startXp: number;
  endXp: number;
}

export const LEVEL_XP_TABLE: LevelRange[] = [
  { level: 1, startXp: 0, endXp: 99 },
  { level: 2, startXp: 100, endXp: 199 },
  { level: 3, startXp: 200, endXp: 399 },
  { level: 4, startXp: 400, endXp: 699 },
  { level: 5, startXp: 700, endXp: 1099 },
  { level: 6, startXp: 1100, endXp: 1599 },
  { level: 7, startXp: 1600, endXp: 2199 },
  { level: 8, startXp: 2200, endXp: 2899 },
  { level: 9, startXp: 2900, endXp: 3699 },
  { level: 10, startXp: 3700, endXp: Infinity },
];

export function getLevelInfo(xp: number) {
  const levelInfo =
    LEVEL_XP_TABLE.find((lvl) => xp >= lvl.startXp && xp <= lvl.endXp) ??
    LEVEL_XP_TABLE[LEVEL_XP_TABLE.length - 1];

  const progress =
    levelInfo.endXp === Infinity
      ? 1
      : Math.min((xp - levelInfo.startXp) / (levelInfo.endXp - levelInfo.startXp), 1);

  return {
    ...levelInfo,
    progress,
  };
}

export interface LevelProgress {
  /** 현재 레벨 구간의 진행률(0~100 정수) */
  percent: number;
  currentXp: number;
  nextLevel: number;
}

/**
 * 서버가 제공한 XP 구간을 결과 화면 진행률로 변환한다.
 * `LEVEL_XP_TABLE`은 서버 구간과 다를 수 있어 사용하지 않는다.
 */
export function toLevelProgress(userLevel: UserLevelResponse): LevelProgress {
  const { xp, minXp, maxXp, nextLevel } = userLevel;
  const range = maxXp - minXp;

  // 최고 레벨은 다음 구간이 없으므로 분모가 0이어도 완료로 처리한다.
  const percent = range <= 0 ? 100 : Math.round(((xp - minXp) / range) * 100);

  return {
    percent: clampPercent(percent),
    currentXp: xp,
    nextLevel,
  };
}

function clampPercent(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}
