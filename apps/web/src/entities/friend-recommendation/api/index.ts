// 추천 목록 무효화 키는 생성 팩토리를 도메인 이름으로 노출한다.
export { getGetRecommendedUsersQueryKey as getRecommendedUsersQueryKey } from '@/shared/api/generated/social-api/social-api';
export { useRecommendedUsersQuery } from './use-recommended-users-query';
