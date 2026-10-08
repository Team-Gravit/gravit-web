import type { ChapterDetailResponse } from '@/shared/api/generated/model';

import { toChapterProgressPercent } from './recent-learning';

export interface Chapter {
  chapterId: number;
  title: string;
  description: string;
  /** UI에 전달하는 0~100 범위의 정수 진행률. */
  progressPercent: number;
}

// 같은 챕터가 화면마다 다른 진행률로 보이지 않도록 메인 화면과 같은 규칙으로
// 반올림한 뒤 0~100 범위로 제한한다.
function toChapterProgress(progressRate: number): number {
  const percent = toChapterProgressPercent(progressRate);

  return Math.min(Math.max(percent, 0), 100);
}

/** 서버가 정한 챕터 순서를 보존한다. 화면에는 별도 정렬 기준이 없다. */
export function toChapterList(response: ChapterDetailResponse[]): Chapter[] {
  return response.map(({ chapterSummaryResponse, chapterProgressRate }) => ({
    chapterId: chapterSummaryResponse.chapterId,
    title: chapterSummaryResponse.title,
    description: chapterSummaryResponse.description,
    progressPercent: toChapterProgress(chapterProgressRate),
  }));
}
