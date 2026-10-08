/** 랭킹 목록에 표시할 검증된 사용자 정보. */
export interface LeagueUser {
  userId: number;
  nickname: string;
  profileImgNumber: number;
  level: number;
  xp: number;
  lp: number;
  rank: number;
}

/** 티어 셀렉터에 표시할 검증된 티어 정보. */
export interface LeagueTierInfo {
  leagueId: number;
  name: string;
  minLp: number;
  maxLp: number;
}

/**
 * OpenAPI가 랭킹 행을 선언하지 않아 소비 경계에서 정의한다.
 * 명세가 행 타입을 제공하면 생성 타입으로 교체한다 (INFRA-024).
 */
export interface LeagueRankRow {
  userId?: number;
  nickname?: string;
  profileImgNumber?: number;
  level?: number;
  xp?: number;
  lp?: number;
  rank?: number;
}

/** 생성된 `SliceResponse.contents`를 랭킹 행으로 좁힌 페이지 타입. */
export interface LeagueRankSlice {
  hasNextPage: boolean;
  contents: LeagueRankRow[];
}
