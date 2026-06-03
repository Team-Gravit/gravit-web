import { userKeys } from '@/entities/user/api/queryKey';

import { leagueKeys, learningKeys, noticeKeys } from '../lib/query-keys';

export const queryKeys = {
  users: userKeys,
  learning: learningKeys,
  league: leagueKeys,
  notice: noticeKeys,
} as const;
