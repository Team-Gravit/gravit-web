import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserLeaguesList } from "@/entities/league/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const getTierLeagues = async (
	leagueId: number,
	pageNum: number,
): Promise<UserLeaguesList> => {
	const response = await apiClient.get<UserLeaguesList>(
		`/ranking/leagues/${leagueId}/page/${pageNum}`,
	);
	return response.data;
};

export const useTierLeagues = (leagueId: number) => {
	return useInfiniteQuery<UserLeaguesList, AxiosError>({
		queryKey: ["userleagues", leagueId],
		queryFn: ({ pageParam = 0 }) =>
			getTierLeagues(leagueId, pageParam as number),
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		initialPageParam: 0,
	});
};
