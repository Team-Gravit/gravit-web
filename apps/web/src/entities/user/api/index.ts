// 생성 API를 도메인 경계에서 다시 노출해 호출부가 생성 경로에 직접 결합하지 않게 한다.
export {
  getGetUserQueryKey as getUserQueryKey,
  getGetUserQueryOptions as getUserQueryOptions,
  useGetUser as useUser,
} from '@/shared/api/generated/user-api/user-api';
export { getGetProfileQueryKey as getUserProfileQueryKey } from '@/shared/api/generated/mainpage-api/mainpage-api';
export { useUserProfile } from './use-user-profile';
