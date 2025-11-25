import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SectionHeader from "@/widgets/header/ui/SectionHeader";
import FriendList from "@/entities/friends/ui/FriendList";
import SearchFriend from "@/features/friends/SearchFriend";
import { useFriendList } from "@/entities/friends/api/getFriendList";
import { useToggleFollow } from "@/entities/friends/api/postFollowButton";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/addfriend",
)({
	component: RouteComponent,
});

export default function RouteComponent() {
	const [searchValue, setSearchValue] = useState("");
	const queryClient = useQueryClient();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
		useFriendList(searchValue);

	const friends = data?.pages.flatMap((p) => p.contents) ?? [];

	useEffect(() => {
		queryClient.removeQueries({ queryKey: ["friendlist"], exact: true });
		if (searchValue.trim()) refetch();
	}, [searchValue, refetch, queryClient]);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 100 &&
				hasNextPage &&
				!isFetchingNextPage
			) {
				fetchNextPage();
			}
		}
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const { mutate: toggleFollow } = useToggleFollow(searchValue);

	return (
		<div className="flex flex-col w-full h-full">
			<SectionHeader title="친구 추가" />
			<div className="flex flex-col px-6 py-6">
				<SearchFriend value={searchValue} onChange={setSearchValue} />
			</div>
			<div className="w-full border-b border-black/20" />
			<div className="flex flex-col gap-3 px-6 pt-3">
				{searchValue.trim() === "" ? (
					<p className="text-xl text-center font-medium mt-2 text-[#22222299]">
						태그나 닉네임으로 친구를 검색하세요.
					</p>
				) : (
					<FriendList
						friends={friends}
						onUpdateFriend={(friend) => toggleFollow(friend)}
					/>
				)}
			</div>
		</div>
	)
}
