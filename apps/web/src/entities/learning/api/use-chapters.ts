import { useGetAllChapter } from '@/shared/api/generated/chapter-api/chapter-api';

import { toChapterList, type Chapter } from '../model/chapter';

/** 서버 응답을 Chapter 모델로 변환해 생성 API의 응답 구조가 화면까지 퍼지지 않게 한다. */
export function useChapters() {
  return useGetAllChapter<Chapter[]>({
    query: { select: toChapterList },
  });
}
