import {
	getFollowings,
	getGetFollowingsInfiniteQueryKey,
} from "@/shared/api/@generated/friend-api/friend-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FollowingList } from "../model/types";

export function useGetFollowingInfiniteTemp(enabled = true) {
	return useInfiniteQuery<FollowingList>({
		queryKey: getGetFollowingsInfiniteQueryKey({}),
		queryFn: ({ signal, pageParam = 0 }) =>
			getFollowings(
				{ page: pageParam as number },
				signal,
			) as Promise<FollowingList>,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		enabled,
		staleTime: 0,

		gcTime: 0,
	});
}
