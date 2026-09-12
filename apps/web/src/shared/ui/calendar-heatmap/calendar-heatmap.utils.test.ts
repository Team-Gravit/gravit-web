import { describe, expect, it } from 'vitest';

import { createHeatmapWeeks, getHeatmapLevel } from './calendar-heatmap.utils';

describe('getHeatmapLevel', () => {
  it('0 이하이면 0을 반환한다', () => {
    expect(getHeatmapLevel(0)).toBe(0);
    expect(getHeatmapLevel(-3)).toBe(0);
  });

  it('경계값에서 단계가 나뉜다 (1~2:1, 3~5:2, 6~9:3, 10+:4)', () => {
    expect(getHeatmapLevel(1)).toBe(1);
    expect(getHeatmapLevel(2)).toBe(1);
    expect(getHeatmapLevel(3)).toBe(2);
    expect(getHeatmapLevel(5)).toBe(2);
    expect(getHeatmapLevel(6)).toBe(3);
    expect(getHeatmapLevel(9)).toBe(3);
    expect(getHeatmapLevel(10)).toBe(4);
    expect(getHeatmapLevel(100)).toBe(4);
  });
});

describe('createHeatmapWeeks', () => {
  it('첫 주는 시작 요일 앞을 빈 셀(date=null)로 채운다', () => {
    // 2023-01-01 은 일요일(getDay=0) → 오프셋 없음. 2024-01-01 은 월요일(getDay=1) → 앞 1칸 빈 셀
    const startDate = new Date(2024, 0, 1);
    const weeks = createHeatmapWeeks({ values: [], startDate, weeks: 1 });

    expect(weeks[0][0]).toEqual({ date: null, count: 0, level: 0 });
    expect(weeks[0][1].date).not.toBeNull();
  });

  it('values의 date와 일치하는 셀에 count와 level을 채운다', () => {
    const startDate = new Date(2024, 0, 1);
    const weeks = createHeatmapWeeks({
      values: [{ date: '2024-01-01', count: 7 }],
      startDate,
      weeks: 1,
    });

    const jan1 = weeks[0].find((day) => day.date === '2024-01-01');
    expect(jan1?.count).toBe(7);
    expect(jan1?.level).toBe(3); // 6~9 → level 3
  });
});
