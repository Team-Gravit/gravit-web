import { useState, useRef } from "react";
import { useFollowerList } from "@/entities/follow/api/getFollowerList";
import { useFollowingList } from "@/entities/follow/api/getFollowingList";
import FollowListWrapper from "@/entities/follow/ui/FollowListWrapper";
import type { Follow } from "@/entities/follow/model/types";
import X from "@/shared/assets/icons/buttons/x.svg?react";

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
	const [activeTab, setActiveTab] = useState<"followers" | "following">(
		initialTab,
	);
	const scrollRef = useRef<HTMLDivElement>(null);

	const followerQuery = useFollowerList();
	const followingQuery = useFollowingList();

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
		<div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
			<div className="bg-white w-[500px] max-h-[80vh] rounded-2xl flex flex-col">
				<div className="flex flex-row items-center justify-between px-6 py-7">
					<h2 className="text-[28px] font-semibold">팔로우</h2>
					<X onClick={onClose} />
				</div>

				<div className="flex w-full">
					<button
						type="button"
						className={`flex-1 flex items-center justify-center h-12 font-semibold text-2xl border-b-2 ${
							activeTab === "followers"
								? "border-black text-black"
								: "border-[#CCC] text-[#CCC]"
						}`}
						onClick={() => setActiveTab("followers")}
					>
						팔로워 {followerCount}
					</button>
					<button
						type="button"
						className={`flex-1 flex items-center justify-center h-12 font-semibold text-2xl border-b-2 ${
							activeTab === "following"
								? "border-black text-black"
								: "border-[#CCC] text-[#CCC]"
						}`}
						onClick={() => setActiveTab("following")}
					>
						팔로잉 {followingCount}
					</button>
				</div>

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
