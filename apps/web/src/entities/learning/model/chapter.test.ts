import { describe, expect, it } from 'vitest';

import type { ChapterDetailResponse } from '@/shared/api/generated/model';

import { toChapterList } from './chapter';

function chapter(
  chapterId: number,
  title: string,
  chapterProgressRate: number,
): ChapterDetailResponse {
  return {
    chapterSummaryResponse: { chapterId, title, description: `${title} 설명` },
    chapterProgressRate,
  };
}

describe('toChapterList', () => {
  it('[]를 넘기면 []를 반환한다', () => {
    expect(toChapterList([])).toEqual([]);
  });

  it('chapterProgressRate 가 0~100 밖이면 범위 안으로 자른다', () => {
    const [under, over] = toChapterList([chapter(1, '자료구조', -10), chapter(2, '운영체제', 150)]);

    expect(under.progressPercent).toBe(0);
    expect(over.progressPercent).toBe(100);
  });

  it('소수점 진행률을 반올림한다', () => {
    const [rounded] = toChapterList([chapter(1, '자료구조', 31.6)]);

    expect(rounded.progressPercent).toBe(32);
  });

  it('응답 순서를 그대로 유지한다', () => {
    const chapters = toChapterList([
      chapter(5, '운영체제', 0),
      chapter(1, '자료구조', 0),
      chapter(3, '네트워크', 0),
    ]);

    expect(chapters.map((item) => item.chapterId)).toEqual([5, 1, 3]);
  });

  it('요약 응답을 화면이 쓰는 평평한 형태로 옮긴다', () => {
    const [first] = toChapterList([chapter(3, '자료구조', 32)]);

    expect(first).toEqual({
      chapterId: 3,
      title: '자료구조',
      description: '자료구조 설명',
      progressPercent: 32,
    });
  });
});
