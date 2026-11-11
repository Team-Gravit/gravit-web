import type { LeagueUser } from '@/entities/league';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';

import { useScrollAnchor } from '../lib/use-scroll-anchor';
import { RankingRowSkeleton } from './ranking-row-skeleton';
import { UserRankRow } from './user-rank-row';

const SKELETON_ROW_COUNT = 8;
// 이 시간(ms) 이상 로딩이 지속될 때만 스켈레톤을 띄운다. 빠른 응답의 깜빡임 방지.
const SKELETON_DELAY_MS = 300;

export interface RankingListProps {
  users: LeagueUser[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** 첫 페이지 로딩 중이면 스켈레톤을 보여준다. */
  isLoading?: boolean;
  /**
   * 내 userId. 주어지면 센터 모드 — 내 행을 중앙에 띄우고 위로도 더 불러온다(내 티어일 때만).
   * 없으면 하단 단방향 무한스크롤.
   */
  myUserId?: number;
  hasPreviousPage?: boolean;
  isFetchingPreviousPage?: boolean;
  onLoadPrevious?: () => void;
  /** 센터링을 애니메이션으로 보여줄지(첫 진입) 즉시 점프할지(티어 전환 재진입). */
  animateCentering?: boolean;
}

/** 랭킹 행 목록. 센터 모드면 내 순위로 스크롤하고 양방향, 아니면 하단으로만 무한로딩한다. */
export function RankingList({
  users,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  isLoading = false,
  myUserId,
  hasPreviousPage = false,
  isFetchingPreviousPage = false,
  onLoadPrevious = () => {},
  animateCentering = true,
}: RankingListProps) {
  const centerMode = myUserId != null;

  // 로딩이 임계 시간을 넘겨야 스켈레톤을 띄운다(빠른 응답은 그냥 데이터로 채움).
  const showSkeleton = useDelayedFlag(isLoading, SKELETON_DELAY_MS);

  const { scrollRef, topSentinelRef, bottomSentinelRef, targetRef } = useScrollAnchor({
    centerMode,
    rowCount: users.length,
    firstRowId: users[0]?.userId ?? null,
    hasTarget: centerMode && users.some((user) => user.userId === myUserId),
    animateCentering,
    hasPreviousPage,
    isFetchingPreviousPage,
    onLoadPrevious,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  });

  if (showSkeleton) {
    return (
      <div className="flex w-full flex-col pt-6 md:px-5.5 md:py-1 gap-3 md:gap-6">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <RankingRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 로딩이 끝났는데 랭킹이 비어 있을 때만 안내한다(로딩 중엔 이 문구를 띄우지 않는다).
  if (!isLoading && users.length === 0) {
    return (
      <div className="flex h-full flex-1 items-center justify-center py-10">
        <p className="text-center text-body1-normal text-text-2-w">
          해당 티어의 첫 주인공을 기다리고 있어요.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide flex h-full flex-col gap-3 overflow-y-auto pt-6 pb-3 md:gap-6 md:px-5.5 md:py-1"
    >
      {centerMode && <div ref={topSentinelRef} className="h-px shrink-0" />}
      {users.map((user) => (
        <UserRankRow
          key={user.userId}
          ref={user.userId === myUserId ? targetRef : undefined}
          user={user}
        />
      ))}
      <div ref={bottomSentinelRef} className="h-px shrink-0" />
    </div>
  );
}
