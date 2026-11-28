import type { ReactNode } from 'react';

import { useMyPageWeakConcepts, type WeakConceptResponse } from '@/entities/learning';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus, CardStatus, CardStatusButton } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { RankBadge } from '@/shared/ui/rank-badge';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

const CARD_CLASS =
  'gap-4 rounded-8 border border-[#fbf1ff]/60 px-4 py-5 shadow-elevation-1 md:rounded-12 md:px-8 md:py-7';

interface WeakConceptsProps {
  /** 빈 상태 "학습하러 가기" 목적지. 라우팅은 상위(페이지)가 정한다. */
  onGoToLearning?: () => void;
  /** 취약 개념 항목 선택. 유닛 상세로의 라우팅은 상위(페이지)가 정한다. */
  onSelectConcept?: (unitId: number) => void;
}

/**
 * 취약 개념 TOP 7. 오답이 많은 유닛과 오답률을 순위로 보여준다.
 * 카드 셸·헤더는 항상 렌더하고 본문만 로딩·에러·빈 상태·데이터로 바꿔 레이아웃이 튀지 않게 한다.
 */
export function WeakConcepts({ onGoToLearning, onSelectConcept }: WeakConceptsProps) {
  const { data, isPending, isError, refetch } = useMyPageWeakConcepts();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  let body: ReactNode;
  if (isError) {
    body = (
      <CardRetryStatus
        className="py-8"
        sectionName="취약 개념"
        onRetry={() => refetch({ throwOnError: true })}
      />
    );
  } else if (isPending) {
    // 지연되면 스켈레톤을 보이고, 그 전(delay 구간)엔 같은 높이를 invisible 로 잡아 깜빡임·시프트를 막는다.
    body = <WeakConceptsBodySkeleton isHidden={!showSkeleton} />;
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
        {data.map((concept) => (
          <WeakConceptItem key={concept.rank} concept={concept} onSelect={onSelectConcept} />
        ))}
      </ol>
    );
  }

  return (
    <Card className={CARD_CLASS} aria-busy={isPending || undefined}>
      <p className="text-label2 text-text-4 md:text-body1-normal">취약 개념 TOP 7</p>
      {body}
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

function WeakConceptsBodySkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <SkeletonReserve isHidden={isHidden} className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} variant="block" className="h-[50px] w-full rounded-8" />
      ))}
    </SkeletonReserve>
  );
}
