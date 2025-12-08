import { useState } from "react";
import type { Follow } from "@/entities/follow/model/types";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import X from "@/shared/assets/icons/buttons/x.svg?react";
import type { UserInfo } from "@/entities/sidebar/model/types";
import { useToggleFollowModal } from "@/entities/follow/api/postFollowButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRejectFollow } from "@/entities/follow/api/rejectFollowButton";

interface Props {
	item: Follow;
	type: "followers" | "following";
}

export default function FollowListItem({ item, type }: Props) {
	const [isFollowing, setIsFollowing] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const mutation = useToggleFollowModal(type);
	const queryClient = useQueryClient();
	const rejectMutation = useRejectFollow();

	const handleToggle = () => {
		if (isLoading) return;

		setIsFollowing((prev) => !prev);
		setIsLoading(true);

		mutation.mutate(item.id, {
			onError: () => {
				setIsFollowing((prev) => !prev);
			},
			onSettled: () => setIsLoading(false),
		});

		queryClient.setQueryData<UserInfo>(["user-info"], (oldData) => {
			if (!oldData) return oldData;
			return {
				...oldData,
				following: isFollowing ? oldData.following - 1 : oldData.following + 1,
			};
		});
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

			{type === "following" ? (
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
			) : (
				<X
					className="w-5 h-5 cursor-pointer"
					onClick={() => {
						if (isLoading) return;
						setIsLoading(true);

						rejectMutation.mutate(item.id, {
							onSettled: () => setIsLoading(false),
							onSuccess: () => {
								queryClient.setQueryData<UserInfo>(["user-info"], (oldData) => {
									if (!oldData) return oldData;
									return {
										...oldData,
										follower: oldData.follower - 1,
									};
								});
							},
						});
					}}
				/>
			)}
		</li>
	);
}
