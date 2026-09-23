import { type FollowType, useFollowListQuery } from '@/entities/follow';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';

import { FollowListItem } from './follow-list-item';
import { FollowListSkeleton } from './follow-list-skeleton';

interface FollowListContainerProps {
  type: FollowType;
  enabled?: boolean;
  /** 스크롤 컨테이너(모달 내부 목록 등). 무한스크롤 교차 관찰의 root로 쓴다. */
  scrollRoot?: Element | null;
}

/** 선택된 탭의 팔로우 목록을 무한스크롤로 조회해 보여준다. */
export function FollowListContainer({
  type,
  enabled = true,
  scrollRoot,
}: FollowListContainerProps) {
  const { currentQuery, followUsers } = useFollowListQuery({ type });

  const loadMoreRef = useInfiniteScroll({
    enabled,
    root: scrollRoot,
    hasNextPage: currentQuery.hasNextPage,
    isFetchingNextPage: currentQuery.isFetchingNextPage,
    fetchNextPage: currentQuery.fetchNextPage,
  });

  // 탭 전환 등으로 목록 전체를 다시 불러오는 중에는(다음 페이지 로드는 제외) 스켈레톤을 보여준다.
  // 이렇게 해야 항목이 stale 데이터로 마운트되지 않아, refetch 후 최신 isFollowing 으로 렌더된다.
  const isReloadingList = currentQuery.isFetching && !currentQuery.isFetchingNextPage;
  if (currentQuery.isPending || isReloadingList) {
    return <FollowListSkeleton />;
  }

  if (followUsers.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {followUsers.map((user) => (
        <FollowListItem key={`${type}-${user.id}`} type={type} user={user} />
      ))}
      {currentQuery.hasNextPage && <li ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />}
    </ul>
  );
}
