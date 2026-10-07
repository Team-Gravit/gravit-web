import { useGetInbox } from '@/shared/api/generated/notification-api/notification-api';

/** 로그인 유저의 알림 인박스를 조회한다(최근 30일·최신 30건). */
export function useInboxQuery() {
  return useGetInbox();
}
