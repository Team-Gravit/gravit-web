import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { FriendList } from "@/entities/friends/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const getFriendList = async (
	queryText: string,
	page: number,
): Promise<FriendList> => {
	const response = await apiClient.get<FriendList>("/friends/search", {
		params: {
			queryText,
			page,
		},
	});
	return response.data;
};

export const useFriendList = (queryText: string) => {
	return useInfiniteQuery<FriendList, AxiosError>({
		queryKey: ["friendlist", queryText],
		queryFn: ({ pageParam }) => {
			const page = typeof pageParam === "number" ? pageParam : 0;
			return getFriendList(queryText, page);
		},
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		enabled: !!queryText.trim(),
		initialPageParam: 0,
	});
};
