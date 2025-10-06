interface Props {
	activeTab: "followers" | "following";
	setActiveTab: (tab: "followers" | "following") => void;
	followerCount: number;
	followingCount: number;
}

export default function FollowTab({
	activeTab,
	setActiveTab,
	followerCount,
	followingCount,
}: Props) {
	return (
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
	);
}
