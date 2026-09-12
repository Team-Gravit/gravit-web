// 생성 API는 사용자 도메인 배럴을 통해서만 노출한다.
export {
  getGetUserQueryKey as getUserQueryKey,
  getGetUserQueryOptions as getUserQueryOptions,
  useGetUser as useUser,
} from '@/shared/api/generated/user-api/user-api';

// 마이페이지 배너(현재 사용자 프로필 요약). 변환 없이 이름만 도메인 어휘로 노출한다.
export { useGetMyPageBanner as useMyPageBanner } from '@/shared/api/generated/mypage-api/mypage-api';

// 마이페이지 요약 통계(학습률·완료레슨·학습시간·정답률)와 학습 기록(연도별 일별 학습량 + 연도 목록).
export {
  useGetMyPageSummary as useMyPageSummary,
  useGetMyPageLearningHistory as useMyPageLearningHistory,
} from '@/shared/api/generated/mypage-api/mypage-api';
