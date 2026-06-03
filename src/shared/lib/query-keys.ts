/**
 * 프로젝트 전체 TanStack Query 키 중앙 통합 파일
 *
 * 각 도메인의 queryKey 팩토리를 이곳에서 re-export합니다.
 * 사용처에서는 이 파일 하나를 import해 `queryKeys.xxx` 형태로 접근하세요.
 *
 * 의존성 방향: shared → 어떤 레이어도 참조하지 않음
 * 단, 도메인 키 파일들은 각 entities 슬라이스 내부에서 관리됩니다.
 */

export { leagueKeys } from '@/entities/league/api/query-keys';
export { learningKeys } from '@/entities/learning/api/query-keys';
export { noticeKeys } from '@/entities/notice/api/query-keys';
