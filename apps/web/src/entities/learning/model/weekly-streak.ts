import type { WeeklyLearningRecordResponse } from '@/shared/api/generated/model';

export type WeekdayStatus = 'completed' | 'uncompleted' | 'today' | 'upcoming';

export interface WeekdayStreak {
  /** 「월」~「일」 */
  label: string;
  status: WeekdayStatus;
}

const WEEKDAYS: readonly { key: keyof WeeklyLearningRecordResponse; label: string }[] = [
  { key: 'MONDAY', label: '월' },
  { key: 'TUESDAY', label: '화' },
  { key: 'WEDNESDAY', label: '수' },
  { key: 'THURSDAY', label: '목' },
  { key: 'FRIDAY', label: '금' },
  { key: 'SATURDAY', label: '토' },
  { key: 'SUNDAY', label: '일' },
];

/** `Date.getDay()`의 일요일 시작 인덱스를 월요일 시작 인덱스(0~6)로 바꾼다. */
function toMondayFirstIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/**
 * 오늘은 학습 여부와 무관하게 `today`로 표시한다.
 * 과거의 기록 유무는 `completed`와 `uncompleted`, 미래는 `upcoming`으로 구분한다.
 *
 * 오늘의 기준은 호출부가 넘긴 시간이며, UI의 기본값은 사용자 기기의 로컬 시간이다.
 *
 * TODO(API): 서버가 요일별 상태를 내려주면 `today` 인자와 이 계산을 제거하고 응답을 그대로 사용한다.
 */
export function getWeekdayStreaks(
  record: WeeklyLearningRecordResponse,
  today: Date,
): WeekdayStreak[] {
  const todayIndex = toMondayFirstIndex(today);

  return WEEKDAYS.map(({ key, label }, index) => {
    if (index === todayIndex) {
      return { label, status: 'today' };
    }

    if (index < todayIndex) {
      return { label, status: record[key] ? 'completed' : 'uncompleted' };
    }

    return { label, status: 'upcoming' };
  });
}
