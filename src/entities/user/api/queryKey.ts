/**
 * user 도메인 TanStack Query 키 팩토리
 *
 * 설계 원칙:
 * - 모든 하위 키는 `userKeys.all`을 루트로 연쇄(chain)하여 광범위 invalidation을 지원합니다.
 * - infinite query 키에서 page 파라미터를 제거합니다.
 *   (pageParam은 queryFn 내부에서 처리하며, 키는 "리스트 자체"를 식별합니다.)
 * - 기존 sidebarKeys(userInfo, userBadges), friendKeys, mainKeys를 흡수합니다.
 */
export const userKeys = {
  /** 전체 user 도메인 루트. `queryClient.invalidateQueries({ queryKey: userKeys.all })`로 전체 무효화 가능 */
  all: ['users'] as const,

  // ─── 내 정보 ───────────────────────────────────────────────────────────
  /** 인증된 사용자 본인 기본 정보 (me API) */
  me: () => [...userKeys.all, 'me'] as const,

  /** 내 페이지 정보 (마이페이지용) */
  myPage: () => [...userKeys.all, 'myPage'] as const,

  /** 메인 페이지 정보 (학습 현황·미션 등) — 구 mainKeys.mainInfo() */
  mainPage: () => [...userKeys.all, 'mainPage'] as const,

  /** 사이드바에 표시되는 내 프로필 요약 정보 — 구 sidebarKeys.userInfo() */
  info: () => [...userKeys.all, 'info'] as const,

  /** 내 뱃지 목록 — 구 sidebarKeys.userBadges() */
  badges: () => [...userKeys.all, 'badges'] as const,

  // ─── 타 유저 프로필 ────────────────────────────────────────────────────
  /** 특정 유저 프로필 조회 */
  profile: (userId: number) => [...userKeys.all, 'profile', userId] as const,

  // ─── 팔로우 ────────────────────────────────────────────────────────────
  follow: {
    /** follow 그룹 루트 — 팔로우 관련 전체 무효화 시 사용 */
    all: () => [...userKeys.all, 'follow'] as const,

    /** 팔로워/팔로잉 카운트 */
    count: () => [...userKeys.all, 'follow', 'count'] as const,

    /**
     * 팔로워 목록 (infinite query)
     * page를 키에 포함하지 않습니다 — pageParam은 queryFn 내부에서 처리합니다.
     */
    followers: () => [...userKeys.all, 'follow', 'followers'] as const,

    /**
     * 팔로잉 목록 (infinite query)
     * page를 키에 포함하지 않습니다 — pageParam은 queryFn 내부에서 처리합니다.
     */
    following: () => [...userKeys.all, 'follow', 'following'] as const,

    /** 특정 유저에 대한 팔로우 상태 */
    status: (followeeId: number) => [...userKeys.all, 'follow', 'status', followeeId] as const,
  },

  // ─── 친구 검색 ─────────────────────────────────────────────────────────
  friends: {
    /** friends 그룹 루트 — 친구 검색 관련 전체 무효화 시 사용 */
    all: () => [...userKeys.all, 'friends'] as const,

    /**
     * 친구 검색 결과 (infinite query) — 구 friendKeys.listByQuery(query)
     * page를 키에 포함하지 않습니다 — pageParam은 queryFn 내부에서 처리합니다.
     */
    search: (query: string) => [...userKeys.all, 'friends', 'search', query] as const,
  },

  // ─── 유저 검색 ─────────────────────────────────────────────────────────
  /**
   * 유저 검색 결과 (infinite query)
   * page를 키에 포함하지 않습니다 — pageParam은 queryFn 내부에서 처리합니다.
   */
  search: (query: string) => [...userKeys.all, 'search', query] as const,
} as const;

export type UserKeys = typeof userKeys;
