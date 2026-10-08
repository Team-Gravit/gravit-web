import type {
  DayLearningRecordResponse,
  WeeklyLearningRecordResponse,
} from '@/shared/api/generated/model';

export type WeekdayStatus = 'completed' | 'uncompleted' | 'today' | 'upcoming';

export interface WeekdayStreak {
  /** 「월」~「일」 */
  label: string;
  status: WeekdayStatus;
}

type WeekdayKey = Exclude<keyof WeeklyLearningRecordResponse, 'consecutiveSolvedDays'>;

const WEEKDAYS: readonly { key: WeekdayKey; label: string }[] = [
  { key: 'MONDAY', label: '월' },
  { key: 'TUESDAY', label: '화' },
  { key: 'WEDNESDAY', label: '수' },
  { key: 'THURSDAY', label: '목' },
  { key: 'FRIDAY', label: '금' },
  { key: 'SATURDAY', label: '토' },
  { key: 'SUNDAY', label: '일' },
];

function toWeekdayStatus(day: DayLearningRecordResponse): WeekdayStatus {
  if (day.dayTiming === 'TODAY') {
    return 'today';
  }

  if (day.dayTiming === 'FUTURE') {
    return 'upcoming';
  }

  return day.isCompleted ? 'completed' : 'uncompleted';
}

/** 서버가 KST로 계산한 요일별 시점을 화면의 네 가지 상태로 변환한다. */
export function getWeekdayStreaks(record: WeeklyLearningRecordResponse): WeekdayStreak[] {
  return WEEKDAYS.map(({ key, label }) => ({
    label,
    status: toWeekdayStatus(record[key]),
  }));
}
