import type { LeagueRankSlice } from '../model/types';

/**
 * 생성된 `SliceResponse.contents`가 `unknown[]`이므로 랭킹 행 타입으로 좁힌다.
 * 구버전 배열 응답은 서버 전환이 확인될 때까지 호환한다 (INFRA-024).
 */
export function normalizeRankingPage(res: unknown): LeagueRankSlice {
  if (Array.isArray(res)) {
    return { hasNextPage: false, contents: res };
  }
  return res as LeagueRankSlice;
}
