// 생성 API는 사용자 도메인 배럴을 통해서만 노출한다.
export {
  getGetUserQueryKey as getUserQueryKey,
  getGetUserQueryOptions as getUserQueryOptions,
  useGetUser as useUser,
} from '@/shared/api/generated/user-api/user-api';
