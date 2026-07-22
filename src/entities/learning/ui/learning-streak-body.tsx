import type { WeeklyLearningRecordResponse } from '@/shared/api';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';
import WeeklyStreak, { WeeklyStreakSkeleton } from '@/shared/ui/weekly-streak/weekly-streak';

type LearningStreakBodyProps = {
  weeklyRecord?: WeeklyLearningRecordResponse;
  consecutiveSolvedDays?: number;
  isLoading?: boolean;
};

/**
 * 연속 학습일 카드의 본문(표시 전용). 카드 셸/헤더는 상위(widget의 SectionCard)가 소유합니다.
 *
 * 로딩과 성공이 동일한 레이아웃 컨테이너(flex-col gap-2)를 공유하고
 * leaf 노드(숫자, 주간 뱃지)만 스켈레톤 ↔ 실데이터로 교체되어 시프트가 없습니다.
 */
export default function LearningStreakBody({
  weeklyRecord,
  consecutiveSolvedDays = 0,
  isLoading = false,
}: LearningStreakBodyProps) {
  return (
    <div className="min-h-20 w-full flex flex-col gap-2 md:min-h-[88px]">
      <div className="flex items-baseline gap-[5px] text-text-1 text-body1-normal">
        {isLoading ? (
          <Skeleton variant="text" width={20} textSize="title1" />
        ) : (
          <span className="text-title1">{consecutiveSolvedDays}</span>
        )}
        일 연속
      </div>
      {isLoading ? <WeeklyStreakSkeleton /> : <WeeklyStreak weeklyRecord={weeklyRecord} />}
    </div>
  );
}
