import type { WeeklyLearningRecordResponse } from '@/shared/api';

import DayBadge from '../badge/day-badge';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;
const DAY_KEYS: (keyof WeeklyLearningRecordResponse)[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

type WeeklyStreakProps = {
  weeklyRecord?: WeeklyLearningRecordResponse;
};

/**
 * WeeklyStreak의 로딩 표현. 실제 요일 뱃지와 동일한 크기/레이아웃을 유지해
 * 데이터 로드 시 레이아웃 시프트가 없도록 합니다.
 */
export function WeeklyStreakSkeleton() {
  return (
    <ul className="flex gap-3 md:gap-2" aria-hidden>
      {WEEK_DAYS.map((day) => (
        <li key={day}>
          <span className="block size-8 animate-skeleton-pulse rounded-sm bg-gray-300 md:size-10 md:rounded-lg" />
        </li>
      ))}
    </ul>
  );
}

export default function WeeklyStreak({ weeklyRecord }: WeeklyStreakProps) {
  const today = (new Date().getDay() + 6) % 7;

  const getDayStatus = (dayIndex: number): 'completed' | 'today' | 'upcoming' => {
    if (dayIndex === today) return 'today';
    if (dayIndex < today && weeklyRecord?.[DAY_KEYS[dayIndex]]) return 'completed';
    return 'upcoming';
  };

  return (
    <ul className="flex gap-3 md:gap-2">
      {WEEK_DAYS.map((day, dayIndex) => (
        <li key={day}>
          <DayBadge label={day} status={getDayStatus(dayIndex)} />
        </li>
      ))}
    </ul>
  );
}
