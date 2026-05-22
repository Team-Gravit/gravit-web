import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LeagueRankRowDto } from "@/shared/api/@generated";
import { leagueKeys } from "@/entities/league/api/query-keys";

export interface UserLeaguesList {
	hasNextPage: boolean;
	contents: LeagueRankRowDto[];
}

export const useUserLeagueRanking = () => {
	return useInfiniteQuery<UserLeaguesList>({
		queryKey: leagueKeys.userLeagueRanking(),

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
