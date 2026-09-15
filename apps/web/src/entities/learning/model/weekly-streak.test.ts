import { describe, expect, it } from 'vitest';

import { getWeekdayStreaks } from './weekly-streak';

const RECORD = {
  consecutiveSolvedDays: 3,
  MONDAY: true,
  TUESDAY: true,
  WEDNESDAY: true,
  THURSDAY: false,
  FRIDAY: false,
  SATURDAY: false,
  SUNDAY: false,
};

describe('getWeekdayStreaks', () => {
  it('오늘이 수요일이면 월·화 = completed, 수 = today, 목~일 = upcoming 이다 (AC-18)', () => {
    // 2026-09-09는 수요일이다.
    const statuses = getWeekdayStreaks(RECORD, new Date(2026, 8, 9)).map((d) => d.status);

    expect(statuses).toEqual([
      'completed',
      'completed',
      'today',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);
  });

  it('오늘은 기록이 있어도 today다', () => {
    const [, , wednesday] = getWeekdayStreaks(RECORD, new Date(2026, 8, 9));

    expect(wednesday.status).toBe('today');
  });

  it('지난 날은 기록에 따라 completed와 uncompleted로 구분한다', () => {
    // 2026-09-13은 일요일이다.
    const statuses = getWeekdayStreaks(
      { ...RECORD, THURSDAY: true, FRIDAY: false, SATURDAY: true },
      new Date(2026, 8, 13),
    ).map((d) => d.status);

    expect(statuses).toEqual([
      'completed',
      'completed',
      'completed',
      'completed',
      'uncompleted',
      'completed',
      'today',
    ]);
  });

  it('레이블은 월~일 순서다', () => {
    expect(getWeekdayStreaks(RECORD, new Date(2026, 8, 9)).map((d) => d.label)).toEqual([
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
      '일',
    ]);
  });
});
