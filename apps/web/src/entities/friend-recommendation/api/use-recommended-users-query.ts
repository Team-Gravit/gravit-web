import { useGetRecommendedUsers } from '@/shared/api/generated/social-api/social-api';

/** 추천 친구 목록을 조회한다. */
export function useRecommendedUsersQuery() {
  return useGetRecommendedUsers();
}
