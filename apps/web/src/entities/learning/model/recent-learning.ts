import type { LearningDetailResponse } from '@/shared/api/generated/model';

import { findNextUnit, toUnitProgressList, type UnitProgress } from './unit-progress';

export interface RecentLearning {
  chapterId: number;
  chapterTitle: string;
  /** 화면에서 사용하는 0~100 퍼센트. */
  progressPercent: number;
  units: UnitProgress[];
  nextUnit: UnitProgress | null;
}

/**
 * API 명세에 단위가 없어 legacy와 같이 0~100으로 가정한다.
 * 실제 응답이 0~1이면 이 변환에서 100을 곱한다.
 */
export function toChapterProgressPercent(progressRate: number): number {
  return Math.round(progressRate);
}

export function toRecentLearning(response: LearningDetailResponse): RecentLearning {
  const units = toUnitProgressList(response.units);

  return {
    chapterId: response.recentSolvedChapterId,
    chapterTitle: response.recentSolvedChapterTitle,
    progressPercent: toChapterProgressPercent(response.recentSolvedChapterProgressRate),
    units,
    nextUnit: findNextUnit(units),
  };
}
