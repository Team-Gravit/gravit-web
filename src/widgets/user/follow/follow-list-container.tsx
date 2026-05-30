import { useGetFollowersInfiniteTemp } from "@/entities/follow/api/use-get-followers-infinite";
import { useGetFollowingInfiniteTemp } from "@/entities/follow/api/use-get-following-infinite";
import type { FollowType } from "@/entities/follow/model/types";
import { useInfiniteScroll } from "@/shared/model/use-infinite-scroll";
import FollowListItem from "./follow-list-item";

interface FollowListContainerProps {
	type: FollowType;
	enabled?: boolean;
}

function FollowListContainer({
	type,
	enabled = true,
}: FollowListContainerProps) {
	const followersQuery = useGetFollowersInfiniteTemp(
		enabled && type === "followers",
	);

	const followingQuery = useGetFollowingInfiniteTemp(
		enabled && type === "following",
	);

	const currentQuery = type === "followers" ? followersQuery : followingQuery;

	const currentTabList =
		currentQuery.data?.pages.flatMap((page) => page.contents) ?? [];

	const loadMoreRef = useInfiniteScroll({
		enabled,
		hasNextPage: currentQuery.hasNextPage,
		isFetchingNextPage: currentQuery.isFetchingNextPage,
		fetchNextPage: currentQuery.fetchNextPage,
	});

	return (
		<>
			{/* TODO : Fallback UI 요청 */}
			{currentTabList.length > 0 && (
				<ul className="flex flex-col">
					{currentTabList.map((user) => (
						<FollowListItem
							key={`${type}-${user.id}`}
							type={type}
							user={user}
						/>
					))}

					{currentQuery.hasNextPage && (
						<li ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />
					)}
				</ul>
			)}
		</>
	);
}

export default FollowListContainer;
