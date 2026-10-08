import { describe, expect, it } from 'vitest';

import type { UnitPageResponse } from '@/shared/api/generated/model';

import { toChapterUnitPage } from './chapter-unit';

function createResponse(
  units: { unitId: number; title?: string; progressRate: number; displayOrder?: number }[],
): UnitPageResponse {
  return {
    chapterSummaryResponse: {
      chapterId: 1,
      title: '자료구조',
      description: '자료를 다루는 방법',
    },
    unitDetailResponses: units.map(
      ({ unitId, title = '연결리스트', progressRate, displayOrder }, index) => ({
        unitSummaryResponse: {
          unitId,
          displayOrder: displayOrder ?? index + 1,
          title,
          description: '설명',
        },
        progressRate,
      }),
    ),
  };
}

describe('toChapterUnitPage', () => {
  it('progressRate 가 0~100 밖이면 범위 안으로 자른다', () => {
    const { units } = toChapterUnitPage(
      createResponse([
        { unitId: 1, progressRate: -5 },
        { unitId: 2, progressRate: 120 },
      ]),
    );

    expect(units.map((unit) => unit.progressPercent)).toEqual([0, 100]);
  });

  it('소수점 진행률을 반올림한다', () => {
    const { units } = toChapterUnitPage(createResponse([{ unitId: 1, progressRate: 33.4 }]));

    expect(units[0].progressPercent).toBe(33);
  });

  it('응답 순서를 유지하고 순번은 displayOrder 를 쓴다', () => {
    const { units } = toChapterUnitPage(
      createResponse([
        { unitId: 7, progressRate: 0, displayOrder: 2 },
        { unitId: 3, progressRate: 0, displayOrder: 1 },
        { unitId: 9, progressRate: 0, displayOrder: 3 },
      ]),
    );

    expect(units.map((unit) => unit.unitId)).toEqual([7, 3, 9]);
    expect(units.map((unit) => unit.order)).toEqual([2, 1, 3]);
  });

  it('챕터 요약을 평평한 형태로 옮긴다', () => {
    const page = toChapterUnitPage(createResponse([]));

    expect(page).toMatchObject({
      chapterId: 1,
      chapterTitle: '자료구조',
      chapterDescription: '자료를 다루는 방법',
      units: [],
    });
  });
});
