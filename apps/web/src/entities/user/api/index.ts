// 생성 API를 도메인 경계에서 다시 노출해 호출부가 생성 경로에 직접 결합하지 않게 한다.
export {
  getGetUserQueryKey as getUserQueryKey,
  getGetUserQueryOptions as getUserQueryOptions,
  useGetUser as useUser,
} from '@/shared/api/generated/user-api/user-api';
export { getGetProfileQueryKey as getUserProfileQueryKey } from '@/shared/api/generated/mainpage-api/mainpage-api';
export { useUserProfile } from './use-user-profile';

// 마이페이지 배너(현재 사용자 프로필 요약). 변환 없이 이름만 도메인 어휘로 노출한다.
// 학습 통계·기록(summaries/history)은 학습 도메인이라 entities/learning 에 있다.
export { useGetMyPageBanner as useMyPageBanner } from '@/shared/api/generated/mypage-api/mypage-api';
