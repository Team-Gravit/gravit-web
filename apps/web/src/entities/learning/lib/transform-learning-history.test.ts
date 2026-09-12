import { afterEach, describe, expect, it, vi } from 'vitest';

import { transformLearningHistoryToHeatmap } from './transform-learning-history';

afterEach(() => {
  vi.useRealTimers();
});

describe('transformLearningHistoryToHeatmap', () => {
  it('연초부터 오늘까지 하루도 빠짐없이 채운다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5)); // 2026-01-05

    const result = transformLearningHistoryToHeatmap([]);

    // 1/1 ~ 1/5 = 5일
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ date: '2026-01-01', count: 0 });
    expect(result[4]).toEqual({ date: '2026-01-05', count: 0 });
  });

  it('서버 데이터가 있는 날짜에 count를 채우고 없는 날은 0으로 둔다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 3));

    const result = transformLearningHistoryToHeatmap([
      { date: '2026-01-02', solvedLessonCount: 4 },
    ]);

    expect(result).toEqual([
      { date: '2026-01-01', count: 0 },
      { date: '2026-01-02', count: 4 },
      { date: '2026-01-03', count: 0 },
    ]);
  });
});
