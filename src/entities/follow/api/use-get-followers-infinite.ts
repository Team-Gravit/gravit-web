import {
	getFollowers,
	getGetFollowersInfiniteQueryKey,
} from "@/shared/api/@generated/friend-api/friend-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FollowerList } from "../model/types";

export function useGetFollowersInfiniteTemp(enabled = true) {
	return useInfiniteQuery<FollowerList>({
		queryKey: getGetFollowersInfiniteQueryKey({}),
		queryFn: ({ signal, pageParam = 0 }) =>
			getFollowers(
				{ page: pageParam as number },
				signal,
			) as Promise<FollowerList>,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		enabled,
		refetchOnMount: true,
		staleTime: 0,
		gcTime: 0,
	});
}
