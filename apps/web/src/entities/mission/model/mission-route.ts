export type MissionRoute = '/learning' | '/my/friends/search';

/**
 * 친구 팔로우 미션은 친구 검색으로 이동한다.
 *
 * 나머지와 알 수 없는 유형은 안전한 기본 목적지인 학습 홈으로 보낸다.
 */
export function getMissionRoute(missionType: string): MissionRoute {
  return missionType === 'FOLLOW_NEW_FRIEND' ? '/my/friends/search' : '/learning';
}
