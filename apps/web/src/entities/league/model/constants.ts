/**
 * 리그 랭킹 한 페이지의 행 수. 서버 랭킹 API(`/ranking/leagues/{id}/page/{n}`)는 `size` 쿼리가 없고
 * default 10으로 고정이다. 이 값으로 내 등수의 앵커 페이지를 계산한다(`getAnchorPage`).
 *
 * ⚠️ 서버 default가 바뀌면 앵커 계산이 틀어진다. 백엔드에 고정 계약을 확인 중(FEAT-081 병행 과제).
 * 응답에 size가 담기게 되면 이 상수 대신 응답값을 쓴다.
 */
export const LEAGUE_PAGE_SIZE = 10;
