import { useEffect, useRef } from 'react';

import { UserRankRow, type LeagueUser } from '@/entities/league';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';

import { RankingRowSkeleton } from './ranking-row-skeleton';

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
}

/** 랭킹 행 목록. 첫 로딩엔 스켈레톤, 하단 센티넬이 보이면 다음 페이지를 불러온다. */
export function RankingList({
  users,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  isLoading = false,
}: RankingListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 로딩이 임계 시간을 넘겨야 스켈레톤을 띄운다(빠른 응답은 그냥 데이터로 채움).
  const showSkeleton = useDelayedFlag(isLoading, SKELETON_DELAY_MS);

  useEffect(() => {
    const target = sentinelRef.current;
    const root = scrollRef.current;
    if (!target || !root || !hasNextPage) return;

    // root를 스크롤 컨테이너로 지정 — 페이지가 아니라 리스트 내부 스크롤에서 무한로딩이 동작한다.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { root, threshold: 1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, users.length]);

  if (showSkeleton) {
    return (
      <div className="flex w-full flex-col gap-3 md:gap-6">
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
      className="scrollbar-hide flex h-full flex-col gap-3 overflow-y-auto md:gap-6 md:px-5.5 md:py-1"
    >
      {users.map((user) => (
        <UserRankRow key={user.userId} user={user} />
      ))}
      <div ref={sentinelRef} className="h-px shrink-0" />
    </div>
  );
}
