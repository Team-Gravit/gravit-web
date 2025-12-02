import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { FollowList } from "@/entities/follow/model/types";
import { mapToFollowList } from "@/entities/follow/model/mappers";

export const useFollowerList = () => {
	return useInfiniteQuery<FollowList>({
		queryKey: ["follower-list"],

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;
			const res = await api.friend.getFollowers(page);
			return mapToFollowList(res.data);
		},

		initialPageParam: 0,

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
	});
};
