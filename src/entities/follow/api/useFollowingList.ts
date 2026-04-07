import { useInfiniteQuery } from "@tanstack/react-query";
import { mapToFollowList } from "@/entities/follow/model/mappers";
import type { FollowList } from "@/entities/follow/model/types";
import { api } from "@/shared/api";
import { userKeys } from "@/entities/user/api/queryKey";

export const useFollowingList = () => {
	return useInfiniteQuery<FollowList>({
		queryKey: userKeys.follow.following(),

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;
			const res = await api.private.friend.getFollowings(page);
			return mapToFollowList(res.data);
		},

		initialPageParam: 0,

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
	});
};
