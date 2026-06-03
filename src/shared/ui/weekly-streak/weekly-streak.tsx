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
