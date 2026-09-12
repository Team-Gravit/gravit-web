/** 랭킹 행에 표시하는 유저. orval `LeagueRankRowDto`의 선택 필드를 화면용으로 정규화한 형태. */
export interface LeagueUser {
  userId: number;
  nickname: string;
  profileImgNumber: number;
  level: number;
  xp: number;
  lp: number;
  rank: number;
}

/** 티어 셀렉터가 쓰는 티어 정보. orval `LeagueResponse`를 화면용으로 정규화한 형태. */
export interface LeagueTierInfo {
  leagueId: number;
  name: string;
  minLp: number;
  maxLp: number;
}
