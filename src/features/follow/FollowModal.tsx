import { useRef, useState, useEffect } from "react";
import type { Follow } from "@/entities/follow/model/types";
import FollowListWrapper from "@/entities/follow/ui/FollowListWrapper";
import FollowTab from "@/features/follow/FollowTab";
import { useFollowerList } from "@/entities/follow/api/useFollowerList";
import { useFollowingList } from "@/entities/follow/api/useFollowingList";
import X from "@/shared/assets/icons/buttons/x.svg?react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	activeTab: "followers" | "following";
	followerCount: number;
	followingCount: number;
}

export default function FollowModal({
	isOpen,
	onClose,
	activeTab: initialTab,
	followerCount,
	followingCount,
}: Props) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState(initialTab);

	const queryClient = useQueryClient();

	const followerQuery = useFollowerList();
	const followingQuery = useFollowingList();

	useEffect(() => {
		if (isOpen) {
			queryClient.invalidateQueries({ queryKey: ["follower-list"] });
			queryClient.invalidateQueries({ queryKey: ["following-list"] });
		}
	}, [isOpen, queryClient]);

	useEffect(() => {
		if (!isOpen) return;

		if (activeTab === "followers") {
			queryClient.invalidateQueries({ queryKey: ["follower-list"] });
		} else {
			queryClient.invalidateQueries({ queryKey: ["following-list"] });
		}
	}, [activeTab, isOpen, queryClient]);

	if (!isOpen) return null;

	const displayedList: Follow[] =
		activeTab === "followers"
			? (followerQuery.data?.pages.flatMap((p) => p.contents) ?? [])
			: (followingQuery.data?.pages.flatMap((p) => p.contents) ?? []);

	const hasNextPage =
		activeTab === "followers"
			? followerQuery.hasNextPage
			: followingQuery.hasNextPage;

	const fetchNextPage =
		activeTab === "followers"
			? followerQuery.fetchNextPage
			: followingQuery.fetchNextPage;

	const isFetchingNextPage =
		activeTab === "followers"
			? followerQuery.isFetchingNextPage
			: followingQuery.isFetchingNextPage;

	const isLoading =
		activeTab === "followers"
			? followerQuery.isLoading
			: followingQuery.isLoading;

	return (
		<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
			<div className="bg-white w-[500px] max-h-[80vh] rounded-2xl flex flex-col">
				<div className="flex flex-row items-center justify-between px-6 py-7">
					<h2 className="text-[28px] font-semibold">팔로우</h2>
					<X className="w-[22px] h-[22px]" onClick={onClose} />
				</div>

				<FollowTab
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					followerCount={followerCount}
					followingCount={followingCount}
				/>

				<FollowListWrapper
					follow={displayedList}
					isLoading={isLoading}
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
					scrollRef={scrollRef}
					type={activeTab}
				/>
			</div>
		</div>
	);
}
