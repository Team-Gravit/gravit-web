import { formatElapsedTime } from '@/shared/lib/date';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { StatItem } from '@/shared/ui/stat-item';
import type { LessonResultResponse } from '@/entities/learning';
import { toLevelProgress } from '@/entities/user';

export interface ResultStatsProps {
  lessonResult: LessonResultResponse;
}

export function ResultStats({ lessonResult }: ResultStatsProps) {
  const { percent, currentXp, nextLevel } = toLevelProgress(lessonResult.userLevelResponse);

  return (
    <div data-slot="result-stats" className="z-1 flex w-full flex-col gap-3 md:gap-6">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-end justify-between text-label1 md:text-body1-normal">
          <span className="text-text-3 md:text-text-1-w">{currentXp}XP</span>
          <span className="text-main md:text-purple-300">LV{nextLevel}까지</span>
        </div>
        <ProgressBar
          value={percent}
          aria-label="다음 레벨까지 남은 경험치"
          className="md:h-[13px] md:[&_[data-slot=progress-bar-fill]]:inset-y-[0.5px]"
        />
      </div>

      <div className="flex w-full items-center rounded-8 bg-bg-0 py-4 md:h-[92px]">
        <StatItem
          valueSize="compact"
          valueTone="muted"
          value={`${lessonResult.accuracy}%`}
          label="정답률"
        />
        <span aria-hidden className="h-10 w-px bg-divider-1 md:h-full" />
        <StatItem
          valueSize="compact"
          valueTone="muted"
          value={formatElapsedTime(lessonResult.learningTime)}
          label="풀이시간"
        />
      </div>
    </div>
  );
}
