import { useCallback, useState } from 'react';

import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { useLessonResult } from '@/entities/learning';

import { LessonResultPageSkeleton } from './lesson-result-page-skeleton';
import { ResultBackground } from './result-background';
import { ResultHero } from './result-hero';
import { ResultStats } from './result-stats';

const HOME_ROUTE = '/main';
const CONTINUE_ROUTE = '/learning/units/$unitId';

const PAGE_LAYOUT_CLASS = 'relative isolate flex min-h-dvh flex-col';

export interface LessonResultPageProps {
  lessonSubmissionId: number;
}

export function LessonResultPage({ lessonSubmissionId }: LessonResultPageProps) {
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);

  const { data: lessonResult, isError, error, refetch } = useLessonResult(lessonSubmissionId);

  const isArtworkVisible = isBackgroundReady && isHeroReady;

  const handleBackgroundReady = useCallback(() => setIsBackgroundReady(true), []);
  const handleHeroReady = useCallback(() => setIsHeroReady(true), []);

  if (isError) {
    // 404는 재시도로 회복되지 않으므로 홈으로 이동할 수 있게 한다.
    const isResultMissing = error?.response?.status === 404;

    return (
      <div
        data-slot="lesson-result-page"
        className={cn(PAGE_LAYOUT_CLASS, 'justify-center bg-bg-1 p-4')}
      >
        {isResultMissing ? (
          <CardStatus
            message="결과를 찾을 수 없어요."
            className="z-10"
            action={
              <Button asChild variant="stroke-default">
                <Link to={HOME_ROUTE}>홈으로</Link>
              </Button>
            }
          />
        ) : (
          <CardRetryStatus sectionName="결과" onRetry={() => void refetch()} className="z-10" />
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="lesson-result-page"
      className={cn(PAGE_LAYOUT_CLASS, 'bg-space-gradient overflow-x-hidden')}
    >
      {/* 로딩 중 받아 둔 배경 이미지를 재사용하도록 같은 인스턴스를 유지한다. */}
      <ResultBackground isVisible={isArtworkVisible} onReady={handleBackgroundReady} />
      {lessonResult ? (
        <main className="z-10 mx-auto flex w-full max-w-[39.375rem] flex-1 flex-col px-4 pt-[4.6875rem] pb-5 md:justify-center md:px-0 md:py-10">
          <div className="md:glass-morphism-border relative flex min-h-0 flex-1 flex-col gap-4 rounded-12 md:flex-none md:gap-10 md:bg-linear-[107deg,rgba(255,255,255,0.24),rgba(255,255,255,0.06)] md:p-8 md:shadow-[0_4px_32px_0_rgba(0,0,0,0.02)] md:backdrop-blur-md md:after:rounded-12">
            <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-none md:gap-8 md:pt-6">
              <div className="flex min-h-0 flex-1 flex-col justify-end md:flex-none">
                <ResultHero
                  chapterId={lessonResult.chapterId}
                  unitTitle={lessonResult.unitSummaryResponse.title}
                  isIllustrationVisible={isArtworkVisible}
                  onIllustrationReady={handleHeroReady}
                />
              </div>
              <ResultStats lessonResult={lessonResult} />
            </div>
            <div className="flex shrink-0 gap-3">
              <Button
                asChild
                variant="stroke-default"
                size="cta"
                className="flex-1 basis-0 bg-bg-0"
              >
                <Link to={HOME_ROUTE}>홈으로</Link>
              </Button>
              <Button asChild size="cta" className="flex-1 basis-0">
                <Link
                  to={CONTINUE_ROUTE}
                  params={{ unitId: String(lessonResult.unitSummaryResponse.unitId) }}
                >
                  이어서 학습하기
                </Link>
              </Button>
            </div>
          </div>
        </main>
      ) : (
        <LessonResultPageSkeleton />
      )}
    </div>
  );
}
