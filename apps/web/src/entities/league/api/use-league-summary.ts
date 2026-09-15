// 별도 변환이 필요 없는 생성 API는 도메인 의미에 맞는 이름으로 이 경계에서 노출한다.
export {
  getGetLeagueQueryKey as getLeagueSummaryQueryKey,
  useGetLeague as useLeagueSummary,
} from '@/shared/api/generated/mainpage-api/mainpage-api';
