import { cn } from '@/shared/lib/cn';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import type { InterviewSessionSummaryResponse } from '@/entities/interview';

import { ScoreComparison } from './score-comparison';
import { ScoreGauge } from './score-gauge';

export interface TotalScoreCardProps {
  summary: InterviewSessionSummaryResponse;
  layout: 'wide' | 'narrow';
}

export function TotalScoreCard({ summary, layout }: TotalScoreCardProps) {
  const isWide = layout === 'wide';

  return (
    <Card className="gap-4 p-4 md:gap-6 md:px-8 md:py-7">
      <CardHeader>
        <CardTitle>전체 점수</CardTitle>
      </CardHeader>
      {/* 좁은 화면에서는 점수와 추이선을 함께 묶고, 넓어지면 게이지와 비교 영역을 나눈다. */}
      <div
        className={cn(
          'flex',
          isWide ? 'h-75 items-center' : 'justify-center gap-4 sm:items-center sm:gap-10',
        )}
      >
        <div className={cn('flex justify-center', isWide && 'flex-1')}>
          <div
            className={cn(
              'relative shrink-0',
              isWide ? 'size-56 lg:size-70.5' : 'size-29.75 sm:size-40',
            )}
          >
            <ScoreGauge
              score={summary.score}
              maxScore={summary.maxScore}
              innerRadiusRatio={isWide ? 0.8 : 0.85}
              knobRatio={isWide ? 0.18 : 0.12}
              className="size-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <p className="text-center">
                <span
                  className={cn(
                    'text-text-1',
                    isWide ? 'text-title1 lg:text-display1' : 'text-heading2 sm:text-title2',
                  )}
                >
                  {summary.score}
                </span>
                <span
                  className={cn(
                    'text-text-4',
                    isWide ? 'text-title3 lg:text-title1' : 'text-body1-normal sm:text-heading2',
                  )}
                >
                  /{summary.maxScore}
                </span>
              </p>
              <span
                className={cn(
                  'text-main-2',
                  isWide ? 'text-body1-normal' : 'text-caption1 sm:text-label2',
                )}
              >
                총점
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex flex-1 flex-col',
            isWide ? 'h-full justify-between' : 'max-w-60 gap-2 sm:max-w-90 sm:gap-3',
          )}
        >
          <ScoreComparison
            label="정확도"
            score={summary.accuracyScore}
            average={summary.averageAccuracyScore}
            recentScores={summary.recentSessions.map((session) => session.accuracyScore)}
            layout={layout}
          />
          <hr className="border-divider-1" />
          <ScoreComparison
            label="전달력"
            score={summary.deliveryScore}
            average={summary.averageDeliveryScore}
            recentScores={summary.recentSessions.map((session) => session.deliveryScore)}
            layout={layout}
          />
        </div>
      </div>
    </Card>
  );
}
