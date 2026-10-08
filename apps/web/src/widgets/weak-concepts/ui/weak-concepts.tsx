import { useMyPageWeakConcepts, type WeakConceptResponse } from '@/entities/learning';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Button } from '@/shared/ui/button';
import { Card, CardStatus } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { RankBadge } from '@/shared/ui/rank-badge';
import { Skeleton } from '@/shared/ui/skeleton';

const CARD_CLASS =
  'gap-4 rounded-8 border border-[#fbf1ff]/60 px-4 py-5 shadow-elevation-1 md:rounded-12 md:px-8 md:py-7';

interface WeakConceptsProps {
  /** 빈 상태 "학습하러 가기" 목적지. 라우팅은 상위(페이지)가 정한다. */
  onGoToLearning?: () => void;
  /** 취약 개념 항목 선택. 유닛 상세로의 라우팅은 상위(페이지)가 정한다. */
  onSelectConcept?: (unitId: number) => void;
}

/** 취약 개념 TOP 7. 오답이 많은 유닛과 오답률을 순위로 보여준다. */
export function WeakConcepts({ onGoToLearning, onSelectConcept }: WeakConceptsProps) {
  const { data, isPending } = useMyPageWeakConcepts();
  const showSkeleton = useDelayedFlag(isPending);

  if (!data) {
    return showSkeleton ? <WeakConceptsSkeleton /> : null;
  }

  return (
    <Card className={CARD_CLASS}>
      <p className="text-label2 text-text-4 md:text-body1-normal">취약 개념 TOP 7</p>

      {data.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {data.map((concept) => (
            <WeakConceptItem key={concept.rank} concept={concept} onSelect={onSelectConcept} />
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

interface WeakConceptItemProps {
  concept: WeakConceptResponse;
  onSelect?: (unitId: number) => void;
}

function WeakConceptItem({ concept, onSelect }: WeakConceptItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(concept.unitId)}
        className="flex w-full items-center gap-5 rounded-8 bg-bg-1 px-4 py-3 text-left"
      >
        <div className="flex flex-1 items-center gap-3 md:gap-4">
          <RankBadge rank={concept.rank} />
          <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
            <span className="truncate text-label1 text-text-2 md:text-heading2">
              {concept.unitTitle}
            </span>
            <span className="truncate text-label2 text-text-4 md:text-label1">
              {concept.chapterTitle} · {concept.wrongAnswerCount}문제 오답
            </span>
          </div>
        </div>
        <Chip variant="outlined">{concept.wrongAnswerRate}%</Chip>
      </button>
    </li>
  );
}

function WeakConceptsSkeleton() {
  return (
    <Card className={CARD_CLASS}>
      <Skeleton variant="text" className="w-32 text-body1-normal" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-[50px] w-full rounded-8" />
        ))}
      </div>
    </Card>
  );
}
