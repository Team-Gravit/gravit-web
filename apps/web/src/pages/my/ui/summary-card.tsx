import type { LearningSummaryResponse } from '@/entities/learning';
import { Card } from '@/shared/ui/card';
import { StatItem } from '@/shared/ui/stat-item';

import CrownIcon from './assets/crown.svg?react';

interface SummaryCardProps {
  learningSummary: LearningSummaryResponse;
}

/**
 * 학습 통계 요약 카드. 데스크톱은 4지표(학습률 상위·완료 레슨·총 학습시간·평균 정답률)를 한 줄로,
 * 모바일은 상단에 "상위 N%" 강조 블록을 두고 3지표만 보여준다(학습률 상위는 숨김).
 */
export function SummaryCard({ learningSummary }: SummaryCardProps) {
  const {
    topPercent,
    completedLessonCount,
    totalLessonCount,
    totalLearningHours,
    averageAccuracy,
  } = learningSummary;

  return (
    <Card className="w-full gap-0 rounded-12 border border-[#fbf1ff]/60 px-0 py-4 shadow-elevation-1 md:rounded-12 md:py-8">
      {/* 모바일 전용: 왕관 + 상위 순위 강조 */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <div className="flex size-10 items-center justify-center rounded-8 bg-purple-100">
          <CrownIcon />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-title3 text-main">상위 {topPercent}%</h3>
          <span className="text-caption1 text-text-4">전체 학습 순위</span>
        </div>
      </div>

      <div className="flex w-full items-center px-4 py-3 md:px-0 md:py-0">
        {/* 학습률 상위: 데스크톱 첫 지표라 구분선 없음. 모바일에서는 숨긴다 */}
        <StatItem className="hidden md:flex" value={`${topPercent}%`} label="학습률 상위" />
        {/* 완료 레슨: 모바일 첫 지표라 구분선 없음, 데스크톱에서만 구분선 */}
        <StatItem
          className="border-l border-divider-1 border-l-0 md:border-l"
          value={
            <>
              {completedLessonCount}개
              <span className="text-caption1 text-text-4 md:text-title3">
                / {totalLessonCount}개
              </span>
            </>
          }
          label="완료 레슨"
        />
        <StatItem
          className="border-l border-divider-1"
          value={`${totalLearningHours}h`}
          label="총 학습시간"
        />
        <StatItem
          className="border-l border-divider-1"
          value={`${averageAccuracy}%`}
          label="평균 정답률"
        />
      </div>
    </Card>
  );
}
