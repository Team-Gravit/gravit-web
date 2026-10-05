import { useState } from 'react';

/**
 * 추천 섹션이 세션 동안 '이번에 팔로우한 userId' 집합을 들고 있다가, 추천 목록이 refetch 되면
 * (dataUpdatedAt 변화) 비운다. 추천 응답에 isFollowing 이 없어 생기는 임시 우회다(FIX-044).
 * 서버가 isFollowing 을 제공하면 이 훅과 로컬 set 을 제거하고 캐시 기반으로 단순화한다.
 */
export function useSessionFollowState(dataUpdatedAt: number) {
  const [followedIds, setFollowedIds] = useState<ReadonlySet<number>>(() => new Set());
  // refetch 로 데이터가 갱신되면 세션 상태를 서버 기준으로 되돌린다. React 의 '렌더 중 상태 조정'
  // 패턴(이전 값을 state 로 들고 비교)으로 flash 없이 리셋한다.
  const [lastUpdatedAt, setLastUpdatedAt] = useState(dataUpdatedAt);

  if (lastUpdatedAt !== dataUpdatedAt) {
    setLastUpdatedAt(dataUpdatedAt);
    if (followedIds.size > 0) {
      setFollowedIds(new Set());
    }
  }

  const markFollowed = (userId: number) => setFollowedIds((prev) => new Set(prev).add(userId));

  const markUnfollowed = (userId: number) =>
    setFollowedIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });

  const isFollowing = (userId: number) => followedIds.has(userId);

  return { isFollowing, markFollowed, markUnfollowed };
}
