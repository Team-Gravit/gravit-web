// 팔로우 수는 생성 훅을 도메인 이름으로 노출한다.
export {
  getGetFollowAndFollowingCountQueryKey as getFollowCountQueryKey,
  useGetFollowAndFollowingCount as useFollowCount,
} from '@/shared/api/generated/friend-api/friend-api';
export { useFollowListQuery } from './use-follow-list-query';
