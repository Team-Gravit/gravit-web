import type { LeagueResponse } from '@/shared/api/generated/model';

import type { LeagueRankRow, LeagueTierInfo, LeagueUser } from './types';

/** 생성 응답의 필수 값을 검증하고 화면용 티어 정보로 변환한다. */
export function mapToTierInfo(raw: LeagueResponse): LeagueTierInfo {
  if (
    raw.leagueId === undefined ||
    !raw.name ||
    raw.minLp === undefined ||
    raw.maxLp === undefined
  ) {
    throw new Error('Invalid league data');
  }
  return {
    leagueId: raw.leagueId,
    name: raw.name,
    minLp: raw.minLp,
    maxLp: raw.maxLp,
  };
}

/** 랭킹 행의 필수 값을 검증하고 화면용 사용자 정보로 변환한다. */
export function mapToLeagueUser(raw: LeagueRankRow): LeagueUser {
  if (
    raw.userId === undefined ||
    !raw.nickname ||
    raw.profileImgNumber === undefined ||
    raw.level === undefined ||
    raw.xp === undefined ||
    raw.lp === undefined
  ) {
    throw new Error('Invalid user data');
  }
  return {
    userId: raw.userId,
    nickname: raw.nickname,
    profileImgNumber: raw.profileImgNumber,
    level: raw.level,
    xp: raw.xp,
    lp: raw.lp,
    rank: raw.rank ?? 0,
  };
}
