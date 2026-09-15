import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import {
  Card,
  CardHeader,
  CardLink,
  CardRetryStatus,
  CardStatus,
  CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { WeeklyStreak, WeeklyStreakSkeleton, useWeeklyRecord } from '@/entities/learning';

export interface LearningStreakProps {
  className?: string;
}

/**
 * `weekly-record` 응답만으로 연속 학습일과 요일 상태를 구성해
 * `learning` 쿼리와 중복 요청하지 않는다.
 */
export function LearningStreak({ className }: LearningStreakProps) {
  const { data: record, isPending, isError, refetch } = useWeeklyRecord();

  let body: ReactNode;
  if (isPending) {
    body = <LearningStreakBodySkeleton />;
  } else if (isError) {
    body = <CardRetryStatus sectionName="학습 기록" onRetry={() => void refetch()} />;
  } else if (record === null) {
    // 빈 상태 시안이 확정되면 레거시 기준선에서 가져온 임시 문구를 교체한다.
    body = (
      <CardStatus
        message="아직 학습 기록이 없어요."
        action={<Link to="/learning">학습 시작하기</Link>}
      />
    );
  } else {
    body = (
      <div data-slot="learning-streak-body" className="flex flex-col gap-2">
        <p className="flex items-baseline gap-1 text-body1-normal text-text-1">
          <span data-slot="streak-days" className="text-title2 md:text-title1">
            {record.consecutiveSolvedDays}
          </span>
          일 연속
        </p>
        <WeeklyStreak record={record} />
      </div>
    );
  }

  return (
    <Card data-section="learning-streak" className={cn('p-4 md:p-5', className)}>
      <CardHeader>
        <CardTitle>연속 학습일</CardTitle>
        <CardLink to="/league">자세히 보기</CardLink>
      </CardHeader>
      {body}
    </Card>
  );
}

function LearningStreakBodySkeleton() {
  return (
    <div data-slot="learning-streak-body" aria-busy="true" className={cn('flex flex-col gap-2')}>
      <p className="flex items-baseline gap-1 text-body1-normal">
        <Skeleton className="w-5 text-title2 md:text-title1" /> 일 연속
      </p>
      <WeeklyStreakSkeleton />
    </div>
  );
}
