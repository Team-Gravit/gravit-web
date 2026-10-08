import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardHeader,
  CardLink,
  CardRetryStatus,
  CardStatus,
  CardTitle,
} from '@/shared/ui/card';
import { LabeledProgressBar } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';
import { UnitProgressList, UnitProgressListSkeleton, useRecentLearning } from '@/entities/learning';

export interface ContinueLearningCardProps {
  className?: string;
}

/** 최근 챕터는 전체 보기로, 다음 미완료 유닛은 이어서 학습하기로 연결한다. */
export function ContinueLearningCard({ className }: ContinueLearningCardProps) {
  const { data: learning, isPending, isError, refetch } = useRecentLearning();
  const nextUnit = learning?.nextUnit ?? null;
  const nextUnitParams = nextUnit ? { unitId: String(nextUnit.unitId) } : null;
  const chapterParams = learning ? { chapterId: String(learning.chapterId) } : null;

  let body: ReactNode;

  if (isPending) {
    body = <ContinueLearningBodySkeleton />;
  } else if (isError) {
    body = <CardRetryStatus sectionName="이어서 학습하기" onRetry={() => void refetch()} />;
  } else if (learning === null) {
    // 빈 상태 시안이 확정되면 레거시 기준선에서 가져온 임시 문구를 교체한다.
    body = (
      <CardStatus
        message="아직 학습 기록이 없어요."
        action={<Link to="/learning">학습 시작하기</Link>}
      />
    );
  } else {
    body = (
      <div data-slot="continue-learning-body" className="flex flex-col gap-4">
        <LabeledProgressBar label={learning.chapterTitle} value={learning.progressPercent} />
        <UnitProgressList units={learning.units} />
        {nextUnit && nextUnitParams ? (
          <Button size="cta" asChild>
            <Link to="/learning/units/$unitId" params={nextUnitParams}>
              {nextUnit.order}강 이어서 학습하기
            </Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <Card data-section="continue-learning" className={className}>
      <CardHeader>
        <CardTitle>이어서 학습하기</CardTitle>
        {chapterParams ? (
          <CardLink to="/learning/chapters/$chapterId" params={chapterParams}>
            전체 학습화면 보기
          </CardLink>
        ) : null}
      </CardHeader>
      {body}
    </Card>
  );
}

function ContinueLearningBodySkeleton() {
  return (
    <div data-slot="continue-learning-body" aria-busy="true" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Skeleton className="w-30 text-heading1" />
          <Skeleton className="w-9 text-body1-normal" />
        </div>
        <Skeleton variant="block" className="h-2 w-full rounded-full" />
      </div>
      <UnitProgressListSkeleton />
      <Skeleton variant="block" className="h-12 w-full md:h-[54px]" />
    </div>
  );
}
