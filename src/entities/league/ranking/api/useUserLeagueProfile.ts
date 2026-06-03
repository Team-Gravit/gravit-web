import { useQuery } from '@tanstack/react-query';

import { leagueKeys } from '@/entities/league/api/query-keys';
import { api } from '@/shared/api';
import type { MyLeagueRankWithProfileResponse } from '@/shared/api/@generated';

export const useUserLeagueProfile = () => {
  return useQuery<MyLeagueRankWithProfileResponse>({
    queryKey: leagueKeys.userLeagueProfile(),
    queryFn: async () => {
      const res = await api.private.myLeagueProfile.getMyLeagueWithProfile();
      return res.data;
    },
    staleTime: 1000 * 60,
    retry: 1,
  });
};
