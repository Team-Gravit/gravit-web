import type { NotificationResponse } from '@/shared/api/generated/model';

/** 알림 한 건. 서버 응답 타입을 도메인 이름으로 재노출한다(재선언하지 않는다). */
export type Notification = NotificationResponse;

/** 액션 버튼 타입. 서버 계약(actionType)의 SoT 집합. 이 밖의 값은 버튼을 렌더하지 않는다. */
export type ActionType =
  | 'NONE'
  | 'FOLLOW_BACK'
  | 'CONGRATULATE'
  | 'GO_TO_LEARNING'
  | 'GO_TO_NOTICE'
  | 'GO_TO_INQUIRY';
