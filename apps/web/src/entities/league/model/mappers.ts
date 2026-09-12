import type { LeagueRankRowDto, LeagueResponse } from '@/shared/api/generated/model';

import type { LeagueTierInfo, LeagueUser } from './types';

/** orval `LeagueResponse` → 화면용 `LeagueTierInfo`. 필수 값이 없으면 잘못된 응답으로 본다. */
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

/** orval `LeagueRankRowDto` → 화면용 `LeagueUser`. 필수 값이 없으면 잘못된 응답으로 본다. */
export function mapToLeagueUser(raw: LeagueRankRowDto): LeagueUser {
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
