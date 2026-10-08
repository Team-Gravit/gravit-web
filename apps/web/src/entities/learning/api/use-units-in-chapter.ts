import { useGetAllUnitInChapter } from '@/shared/api/generated/unit-api/unit-api';

import { toChapterUnitPage, type ChapterUnitPage } from '../model/chapter-unit';

/** 생성 응답을 화면 모델로 변환해 Orval 계약을 엔티티 경계에 가둔다. */
export function useUnitsInChapter(chapterId: number) {
  return useGetAllUnitInChapter<ChapterUnitPage>(chapterId, {
    query: {
      select: toChapterUnitPage,
      enabled: Number.isFinite(chapterId),
    },
  });
}
