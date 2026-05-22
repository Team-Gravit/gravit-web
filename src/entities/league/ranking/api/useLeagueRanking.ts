import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LeagueRankRowDto } from "@/shared/api/@generated";
import { leagueKeys } from "@/entities/league/api/query-keys";

interface LeagueRankingResponse {
	hasNextPage: boolean;
	contents: LeagueRankRowDto[];
}

export const useLeagueRanking = (leagueId: number) => {
	return useInfiniteQuery<LeagueRankingResponse>({
		queryKey: leagueKeys.ranking(leagueId),

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;

			const res = await api.private.leagueRank.getLeagueRanking(leagueId, page);

			return res.data as unknown as LeagueRankingResponse;
		},

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,

		initialPageParam: 0,
	});
};
