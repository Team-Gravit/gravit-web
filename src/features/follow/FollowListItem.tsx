import { useState } from "react";
import type { Follow } from "@/entities/follow/model/types";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import {
	followFriend,
	unfollowFriend,
} from "@/entities/friends/api/postFollowButton";

interface Props {
	item: Follow;
	type: "followers" | "following";
}

export default function FollowListItem({ item, type }: Props) {
	const [isFollowing, setIsFollowing] = useState(type === "following");
	const [isLoading, setIsLoading] = useState(false);

	const handleToggle = async () => {
		if (isLoading) return;
		setIsFollowing((prev) => !prev);
		setIsLoading(true);

		try {
			if (isFollowing) await unfollowFriend(item.id);
			else await followFriend(item.id);
		} catch (err) {
			console.error("API 호출 실패:", err);
			setIsFollowing((prev) => !prev);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<li className="flex items-center justify-between p-2 hover:bg-gray-50">
			<div className="flex items-center gap-6">
				<Profile
					className="w-14 h-14"
					style={{
						color:
							PROFILE_COLORS[
								item.profileImgNumber as keyof typeof PROFILE_COLORS
							] ?? "#ccc",
					}}
				/>
				<div className="flex flex-col">
					<span className="font-semibold text-2xl">{item.nickname}</span>
					<span className="text-[#494949] font-normal text-2xl">
						@{item.handle}
					</span>
				</div>
			</div>

			<button
				type="button"
				disabled={isLoading}
				className={`flex justify-center items-center px-6 py-3 gap-4 rounded-[10px] w-[151px] h-[51px] text-xl font-normal transition
          ${
						isFollowing
							? "bg-white border border-black/10 text-black hover:bg-gray-50"
							: "bg-purple-800 text-white hover:bg-purple-700"
					}`}
				onClick={handleToggle}
			>
				{isFollowing ? "팔로우 취소" : "팔로우"}
			</button>
		</li>
	);
}
