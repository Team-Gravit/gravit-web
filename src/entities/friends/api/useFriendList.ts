import { useInfiniteQuery } from "@tanstack/react-query";
import { mapToFriendList } from "@/entities/friends/model/mappers";
import type { FriendList } from "@/entities/friends/model/types";
import { api } from "@/shared/api";
import { userKeys } from "@/entities/user/api/queryKey";

export const useFriendList = (queryText: string) => {
	return useInfiniteQuery<FriendList>({
		queryKey: userKeys.friends.search(queryText),

		queryFn: async ({ pageParam = 0 }) => {
			const page = pageParam as number;
			const res = await api.private.friendSearch.search(queryText, page);
			return mapToFriendList(res.data);
		},

		initialPageParam: 0,

		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,

		enabled: !!queryText.trim(),
	});
};
