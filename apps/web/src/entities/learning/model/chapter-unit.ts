import type { UnitPageResponse } from '@/shared/api/generated/model';

import { toChapterProgressPercent } from './recent-learning';

export interface ChapterUnit {
  unitId: number;
  title: string;
  description: string;
  /** UI에 전달하는 0~100 범위의 정수 진행률. */
  progressPercent: number;
  /** 「Unit01」의 번호. 서버가 주는 `displayOrder`다. */
  order: number;
}

export interface ChapterUnitPage {
  chapterId: number;
  chapterTitle: string;
  chapterDescription: string;
  units: ChapterUnit[];
}

// 챕터 진행률과 동일한 반올림 규칙을 적용한다.
function toUnitProgress(progressRate: number): number {
  const percent = toChapterProgressPercent(progressRate);

  return Math.min(Math.max(percent, 0), 100);
}

/** 서버 순서를 보존하고 `displayOrder`를 표시 순번으로 사용한다. */
export function toChapterUnitPage(response: UnitPageResponse): ChapterUnitPage {
  const { chapterSummaryResponse, unitDetailResponses } = response;

  return {
    chapterId: chapterSummaryResponse.chapterId,
    chapterTitle: chapterSummaryResponse.title,
    chapterDescription: chapterSummaryResponse.description,
    units: unitDetailResponses.map(({ unitSummaryResponse, progressRate }) => ({
      unitId: unitSummaryResponse.unitId,
      title: unitSummaryResponse.title,
      description: unitSummaryResponse.description,
      progressPercent: toUnitProgress(progressRate),
      order: unitSummaryResponse.displayOrder,
    })),
  };
}
