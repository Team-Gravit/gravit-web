import { describe, expect, it } from 'vitest';

import type { SeasonHistoryEntry } from '@/shared/api/generated/model/seasonHistoryEntry';

import { toLeagueChartData } from './league-chart';

const entry = (over: Partial<SeasonHistoryEntry>): SeasonHistoryEntry => ({
  seasonKey: 's',
  displayKey: 'S',
  leagueName: '브론즈 3',
  sortOrder: 1,
  isCurrent: false,
  ...over,
});

describe('toLeagueChartData', () => {
  it('등장한 티어를 sortOrder 오름차순으로 yTicks에 담는다', () => {
    const { yTicks } = toLeagueChartData([
      entry({ sortOrder: 3, leagueName: '실버 1' }),
      entry({ sortOrder: 1, leagueName: '브론즈 3' }),
    ]);

    expect(yTicks.map((tick) => tick.value)).toEqual([1, 2]);
    expect(yTicks.map((tick) => tick.label)).toEqual(['B3', 'S1']);
  });

  it('중복 티어는 한 번만 눈금이 된다', () => {
    const { yTicks } = toLeagueChartData([
      entry({ sortOrder: 2, leagueName: '브론즈 2' }),
      entry({ sortOrder: 2, leagueName: '브론즈 2' }),
    ]);

    expect(yTicks).toHaveLength(1);
  });

  it('x는 인덱스 순서, isCurrent는 highlight로 매핑한다', () => {
    const { points } = toLeagueChartData([
      entry({ seasonKey: 'a', sortOrder: 1 }),
      entry({ seasonKey: 'b', sortOrder: 3, isCurrent: true }),
    ]);

    expect(points[0].x).toBe(0);
    expect(points[1].x).toBe(1);
    expect(points[1].highlight).toBe(true);
    // 상위 티어(sortOrder 3)가 더 큰 y 값을 갖는다
    expect(points[1].y).toBeGreaterThan(points[0].y);
  });
});
