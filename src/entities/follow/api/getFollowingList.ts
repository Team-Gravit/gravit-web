import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { FollowList } from "@/entities/follow/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const getFollowingList = async (page: number): Promise<FollowList> => {
	const response = await apiClient.get<FollowList>("/friends/following", {
		params: {
			page,
		},
	});
	return response.data;
};

export const useFollowingList = () => {
	return useInfiniteQuery<FollowList, AxiosError>({
		queryKey: ["followinglist"],
		queryFn: ({ pageParam }) => {
			const page = typeof pageParam === "number" ? pageParam : 0;
			return getFollowingList(page);
		},
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		initialPageParam: 0,
		staleTime: 0,
		refetchOnMount: true,
	});
};
