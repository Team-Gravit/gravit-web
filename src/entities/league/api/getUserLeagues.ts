import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserLeaguesList } from "@/entities/league/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const getUserLeagues = async (pageNum: number): Promise<UserLeaguesList> => {
	const response = await apiClient.get<UserLeaguesList>(
		`ranking/user-leagues/page/${pageNum}`,
	);
	return response.data;
};

export const useUserLeagues = () => {
	return useInfiniteQuery<UserLeaguesList, AxiosError>({
		queryKey: ["userleagues"],
		queryFn: ({ pageParam = 0 }) => getUserLeagues(pageParam as number),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.hasNextPage) {
				return allPages.length;
			}
			return undefined;
		},
		initialPageParam: 0,
	});
};
