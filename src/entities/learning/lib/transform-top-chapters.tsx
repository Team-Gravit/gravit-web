import type { TopChapterResponse } from '@/shared/api/@generated/model';

export function transformTopChapters(data: TopChapterResponse[]) {
  return data
    .sort((d1, d2) => d1.rank - d2.rank)
    .map(({ chapterTitle, solvedLessonCount, ratio }) => ({
      concept: chapterTitle,
      count: solvedLessonCount,
      percent: ratio,
    }));
}
