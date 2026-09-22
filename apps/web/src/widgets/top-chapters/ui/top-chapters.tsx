import { useMyPageTopChapters, type TopChapterResponse } from '@/entities/learning';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Button } from '@/shared/ui/button';
import { Card, CardStatus } from '@/shared/ui/card';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { RankBadge } from '@/shared/ui/rank-badge';
import { Skeleton } from '@/shared/ui/skeleton';

const CARD_CLASS =
  'gap-4 rounded-8 border border-[#fbf1ff]/60 px-4 py-5 shadow-elevation-1 md:rounded-12 md:px-8 md:py-7';

interface TopChaptersProps {
  /** 빈 상태 "학습하러 가기" 목적지. 라우팅은 상위(페이지)가 정한다. */
  onGoToLearning?: () => void;
}

/** 이번 주 가장 많이 푼 챕터 순위. 챕터별 완료 수와 비중 막대를 보여준다. */
export function TopChapters({ onGoToLearning }: TopChaptersProps) {
  const { data, isPending } = useMyPageTopChapters();
  const showSkeleton = useDelayedFlag(isPending);

  if (!data) {
    return showSkeleton ? <TopChaptersSkeleton /> : null;
  }

  return (
    <Card className={CARD_CLASS}>
      <div className="flex flex-col gap-2">
        <p className="text-label2 text-text-4 md:text-body1-normal">이번 주 가장 많이 푼 챕터</p>
        {data.length > 0 && (
          <p className="text-headline2 text-text-1 md:text-title3">어떤 주제에 집중했나요?</p>
        )}
      </div>

      {data.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {data.map((chapter) => (
            <TopChapterItem key={chapter.rank} chapter={chapter} />
          ))}
        </ol>
      ) : (
        <CardStatus
          className="whitespace-pre-line py-8"
          message={'이번주 학습한 내용이 없어요.\n어서 학습을 진행해 주세요.'}
          action={
            <Button size="lg" className="text-headline2" onClick={onGoToLearning}>
              학습하러 가기
            </Button>
          }
        />
      )}
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

function TopChaptersSkeleton() {
  return (
    <Card className={CARD_CLASS}>
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="w-40 text-body1-normal" />
        <Skeleton variant="text" className="w-48 text-title3" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-[53px] w-full rounded-8" />
        ))}
      </div>
    </Card>
  );
}
