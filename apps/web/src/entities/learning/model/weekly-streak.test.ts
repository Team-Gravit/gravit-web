import { describe, expect, it } from 'vitest';

import type { WeeklyLearningRecordResponse } from '@/shared/api/generated/model';

import { getWeekdayStreaks } from './weekly-streak';

const RECORD = {
  consecutiveSolvedDays: 3,
  MONDAY: { dayTiming: 'PAST', isCompleted: true },
  TUESDAY: { dayTiming: 'PAST', isCompleted: false },
  WEDNESDAY: { dayTiming: 'TODAY', isCompleted: true },
  THURSDAY: { dayTiming: 'FUTURE', isCompleted: false },
  FRIDAY: { dayTiming: 'FUTURE', isCompleted: false },
  SATURDAY: { dayTiming: 'FUTURE', isCompleted: false },
  SUNDAY: { dayTiming: 'FUTURE', isCompleted: false },
} satisfies WeeklyLearningRecordResponse;

describe('getWeekdayStreaks', () => {
  it('서버의 시점과 완료 여부를 네 가지 화면 상태로 변환한다 (AC-18)', () => {
    const statuses = getWeekdayStreaks(RECORD).map((day) => day.status);

    expect(statuses).toEqual([
      'completed',
      'uncompleted',
      'today',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);
  });

  it('오늘은 완료 여부와 관계없이 today다', () => {
    const [, , wednesday] = getWeekdayStreaks({
      ...RECORD,
      WEDNESDAY: { dayTiming: 'TODAY', isCompleted: false },
    });

    expect(wednesday.status).toBe('today');
  });

  it('지난 요일은 완료 여부에 따라 completed와 uncompleted로 구분한다', () => {
    const [monday, tuesday] = getWeekdayStreaks(RECORD);

    expect(monday.status).toBe('completed');
    expect(tuesday.status).toBe('uncompleted');
  });

  it('레이블은 월~일 순서다', () => {
    expect(getWeekdayStreaks(RECORD).map((day) => day.label)).toEqual([
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
