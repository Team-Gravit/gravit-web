import type { ReactNode } from 'react';

import { useMyPageTopChapters, type TopChapterResponse } from '@/entities/learning';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus, CardStatus, CardStatusButton } from '@/shared/ui/card';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { RankBadge } from '@/shared/ui/rank-badge';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

const CARD_CLASS =
  'gap-4 rounded-8 border border-[#fbf1ff]/60 px-4 py-5 shadow-elevation-1 md:rounded-12 md:px-8 md:py-7';

interface TopChaptersProps {
  /** 빈 상태 "학습하러 가기" 목적지. 라우팅은 상위(페이지)가 정한다. */
  onGoToLearning?: () => void;
}

/**
 * 이번 주 가장 많이 푼 챕터 순위. 챕터별 완료 수와 비중 막대를 보여준다.
 * 카드 셸·헤더는 항상 렌더하고 본문만 로딩·에러·빈 상태·데이터로 바꿔 레이아웃이 튀지 않게 한다.
 */
export function TopChapters({ onGoToLearning }: TopChaptersProps) {
  const { data, isPending, isError, refetch } = useMyPageTopChapters();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);
  const hasChapters = !!data && data.length > 0;

  let body: ReactNode;
  if (isError) {
    body = (
      <CardRetryStatus
        className="py-8"
        sectionName="많이 푼 챕터"
        onRetry={() => refetch({ throwOnError: true })}
      />
    );
  } else if (isPending) {
    // 지연되면 스켈레톤을 보이고, 그 전(delay 구간)엔 같은 높이를 invisible 로 잡아 깜빡임·시프트를 막는다.
    body = <TopChaptersBodySkeleton isHidden={!showSkeleton} />;
  } else if (!data || data.length === 0) {
    body = (
      <CardStatus
        className="whitespace-pre-line py-8"
        message={'이번주 학습한 내용이 없어요.\n어서 학습을 진행해 주세요.'}
        action={
          <CardStatusButton type="button" onClick={onGoToLearning}>
            학습하러 가기
          </CardStatusButton>
        }
      />
    );
  } else {
    body = (
      <ol className="flex flex-col gap-3">
        {data.map((chapter) => (
          <TopChapterItem key={chapter.rank} chapter={chapter} />
        ))}
      </ol>
    );
  }

  return (
    <Card className={CARD_CLASS} aria-busy={isPending || undefined}>
      <div className="flex flex-col gap-2">
        <p className="text-label2 text-text-4 md:text-body1-normal">이번 주 가장 많이 푼 챕터</p>
        {hasChapters && (
          <p className="text-headline2 text-text-1 md:text-title3">어떤 주제에 집중했나요?</p>
        )}
      </div>
      {body}
    </Card>
  );
}

function TopChapterItem({ chapter }: { chapter: TopChapterResponse }) {
  return (
    <li className="flex items-center gap-3 rounded-8 bg-bg-1 p-4 md:gap-4 md:py-5">
      <RankBadge rank={chapter.rank} />
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-text-2">
          <span className="text-label1 md:text-heading2">{chapter.chapterTitle}</span>
          <span className="text-body1-normal">{chapter.solvedLessonCount}개</span>
        </div>
        <ProgressBar
          value={chapter.ratio}
          fill="gradient"
          className="bg-bg-3"
          aria-label={`${chapter.chapterTitle} 학습 비중`}
        />
      </div>
    </li>
  );
}

function TopChaptersBodySkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <SkeletonReserve isHidden={isHidden} className="flex flex-col gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="block" className="h-[50px] md:h-[56px] w-full rounded-8" />
      ))}
    </SkeletonReserve>
  );
}
