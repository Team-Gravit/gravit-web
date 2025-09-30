import { useState } from "react";
import type { UserInfo } from "@/entities/sidebar/model/types";
import FollowModal from "@/features/follow/FollowModal";

interface Props {
	userInfo: UserInfo;
}

export default function FollowModalButton({ userInfo }: Props) {
	const [modalOpen, setModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"followers" | "following">(
		"followers",
	);

	return (
		<>
			<div className="flex flex-row items-center justify-center mt-4 mb-4 gap-5 text-[#222222]/80 text-2xl">
				<button
					type="button"
					className="w-[146.5px] h-12 flex flex-row items-center justify-center border border-[#000000]/10 rounded-lg gap-2"
					onClick={() => {
						setActiveTab("followers");
						setModalOpen(true);
					}}
				>
					팔로워 <span className="font-medium">{userInfo.follower}</span>
				</button>
				<button
					type="button"
					className="w-[146.5px] h-12 flex flex-row items-center justify-center border border-[#000000]/10 rounded-lg gap-2"
					onClick={() => {
						setActiveTab("following");
						setModalOpen(true);
					}}
				>
					팔로잉 <span className="font-medium">{userInfo.following}</span>
				</button>
			</div>

			{modalOpen && (
				<FollowModal
					isOpen={modalOpen}
					activeTab={activeTab}
					onClose={() => setModalOpen(false)}
					followerCount={userInfo.follower}
					followingCount={userInfo.following}
				/>
			)}
		</>
	);
}
