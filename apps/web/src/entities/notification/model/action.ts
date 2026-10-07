import type { Notification } from './types';

/** 이동형 액션의 대상 경로. 확정 라우트만 허용한다(TanStack Link 타입 안전). */
type NotificationLinkPath = '/learning' | '/settings/notice' | '/settings/inquiry';

/**
 * 알림 1건이 어떤 액션 노드를 렌더해야 하는지 서술한다(순수).
 * 라우팅·mutation 은 모르고, 상위(위젯/페이지)가 이 서술자를 보고 `<Link>`나 feature 버튼을 꽂는다.
 */
export type NotificationActionDescriptor =
  | { kind: 'none' }
  | { kind: 'link'; label: string; to: NotificationLinkPath }
  | { kind: 'follow'; userId: number; initiallyFollowing: boolean }
  | { kind: 'congratulate'; feedId: number; congratulated: boolean };

/** actionType → 이동형 액션(카피·경로). 기획이 바꾸는 관리 포인트. */
const LINK_ACTIONS: Record<string, { label: string; to: NotificationLinkPath }> = {
  GO_TO_LEARNING: { label: '학습하러 가기', to: '/learning' },
  GO_TO_NOTICE: { label: '공지 보러가기', to: '/settings/notice' },
  GO_TO_INQUIRY: { label: '문의 보러가기', to: '/settings/inquiry' },
};

/**
 * actionType 을 SoT 로 액션 서술자를 만든다.
 * - FOLLOW 타입은 FOLLOW_BACK(미팔로우)·NONE(이미 팔로우)로 토글 버튼을 렌더한다(FEAT-047 결정).
 * - actionType 에 대응이 없는 값은 버튼을 렌더하지 않는다(`none`).
 */
export function getActionDescriptor(notification: Notification): NotificationActionDescriptor {
  const { type, actionType, targetId, congratulated, actor } = notification;

  const link = LINK_ACTIONS[actionType];
  if (link) {
    return { kind: 'link', label: link.label, to: link.to };
  }

  // 팔로우 토글은 상대 유저(actor)가 있어야 가능하다. 없으면 버튼을 렌더하지 않는다.
  if (actionType === 'FOLLOW_BACK') {
    return actor
      ? { kind: 'follow', userId: actor.profileId, initiallyFollowing: false }
      : { kind: 'none' };
  }

  if (actionType === 'CONGRATULATE' && targetId !== undefined) {
    return { kind: 'congratulate', feedId: targetId, congratulated: congratulated ?? false };
  }

  // FOLLOW 알림의 NONE 은 '이미 팔로우 중' → 팔로우 취소 토글.
  if (actionType === 'NONE' && type === 'FOLLOW') {
    return actor
      ? { kind: 'follow', userId: actor.profileId, initiallyFollowing: true }
      : { kind: 'none' };
  }

  return { kind: 'none' };
}
