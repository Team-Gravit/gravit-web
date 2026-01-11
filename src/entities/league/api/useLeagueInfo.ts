import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LeagueResponse } from "@/shared/api/@generated";

export const useLeagueInfo = (leagueId: number) => {
	return useQuery<LeagueResponse>({
		queryKey: ["league-info", leagueId],
		queryFn: async () => {
			const res = await api.private.league.getLeague(leagueId);
			return res.data;
		},
		staleTime: 1000 * 60,
	});
};
