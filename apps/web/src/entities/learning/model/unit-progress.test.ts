import { describe, expect, it } from 'vitest';

import { findNextUnit, formatUnitNumber, toUnitProgressList } from './unit-progress';

const UNITS = toUnitProgressList([
  { unitId: 11, title: '배열', status: 'COMPLETED' },
  { unitId: 12, title: '스택', status: 'IN_PROGRESS' },
  { unitId: 13, title: '큐', status: 'NOT_STARTED' },
]);

describe('toUnitProgressList', () => {
  it('status enum 을 3종 상태로, 순번을 1부터 매긴다', () => {
    expect(UNITS.map((unit) => [unit.order, unit.status])).toEqual([
      [1, 'completed'],
      [2, 'inProgress'],
      [3, 'locked'],
    ]);
  });
});

describe('findNextUnit', () => {
  it('완료되지 않은 첫 유닛을 고른다 — unitId 12, 순번 2 (AC-11)', () => {
    expect(findNextUnit(UNITS)).toMatchObject({ unitId: 12, order: 2 });
  });

  it('전부 완료면 null 이다', () => {
    const allCompleted = UNITS.map((unit) => ({ ...unit, status: 'completed' as const }));
    expect(findNextUnit(allCompleted)).toBeNull();
  });

  it('[] 면 null 이다', () => {
    expect(findNextUnit([])).toBeNull();
  });
});

describe('formatUnitNumber', () => {
  it('두 자리로 0 을 채운다', () => {
    expect(formatUnitNumber(1)).toBe('01');
    expect(formatUnitNumber(12)).toBe('12');
  });
});
