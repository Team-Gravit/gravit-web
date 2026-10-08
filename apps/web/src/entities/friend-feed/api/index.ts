// 피드 무효화 키는 생성 팩토리를 도메인 이름으로 노출한다.
export { getGetFeedInfiniteQueryKey as getFriendFeedQueryKey } from '@/shared/api/generated/social-api/social-api';
export { useFriendFeedQuery } from './use-friend-feed-query';
