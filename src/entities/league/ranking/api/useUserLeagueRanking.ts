import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LeagueRankRow } from "@/shared/api/@generated";

export interface UserLeaguesList {
	hasNextPage: boolean;
	contents: LeagueRankRow[];
}

export const useUserLeagueRanking = () => {
	return useInfiniteQuery<UserLeaguesList>({
		queryKey: ["user-league-ranking"],

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;

			const res = await api.private.leagueRank.getLeagueRankingByUser(page);

			return res.data as unknown as UserLeaguesList;
		},

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,

		initialPageParam: 0,
	});
};
