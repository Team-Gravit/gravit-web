import { useQuery } from '@tanstack/react-query';

import type { LeagueHomeResponse } from '@/shared/api/@generated';
import { api } from '@/shared/api/index';

import { leagueKeys } from './query-keys';

export const useSeasonInfo = () => {
  return useQuery<LeagueHomeResponse>({
    queryKey: leagueKeys.seasonInfo(),
    queryFn: async () => {
      const res = await api.private.league.enterHome();
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};
