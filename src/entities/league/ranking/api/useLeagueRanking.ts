import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LeagueRankRow } from "@/shared/api/@generated";

interface LeagueRankingResponse {
	hasNextPage: boolean;
	contents: LeagueRankRow[];
}

export const useLeagueRanking = (leagueId: number) => {
	return useInfiniteQuery<LeagueRankingResponse>({
		queryKey: ["league-ranking", leagueId],

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;

			const res = await api.ranking.global.getLeagueRanking(leagueId, page);

			return res.data as unknown as LeagueRankingResponse;
		},

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,

		initialPageParam: 0,
	});
};
