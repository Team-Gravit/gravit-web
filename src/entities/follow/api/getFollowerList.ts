import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { FollowList } from "@/entities/follow/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const getFollowerList = async (page: number): Promise<FollowList> => {
	const response = await apiClient.get<FollowList>("/friends/follower", {
		params: {
			page,
		},
	});
	return response.data;
};

export const useFollowerList = () => {
	return useInfiniteQuery<FollowList, AxiosError>({
		queryKey: ["followerlist"],
		queryFn: ({ pageParam }) => {
			const page = typeof pageParam === "number" ? pageParam : 0;
			return getFollowerList(page);
		},
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		initialPageParam: 0,
		staleTime: 0,
		refetchOnMount: true,
	});
};
