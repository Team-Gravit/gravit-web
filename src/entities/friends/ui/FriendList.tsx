import type { Friend } from "@/entities/friends/model/types";
import FollowButton from "@/features/friends/FollowButton";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";

interface FriendListProps {
	friends: Friend[];
	onUpdateFriend?: (friend: Friend) => void;
}

export default function FriendList({
	friends,
	onUpdateFriend,
}: FriendListProps) {
	if (friends.length === 0) {
		return (
			<p className="text-xl font-medium text-[#22222299] text-center mt-2">
				해당 아이디를 찾을 수 없습니다.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{friends.map((friend) => (
				<div
					key={friend.userId}
					className="flex items-center justify-between w-full p-2 bg-white"
				>
					<div className="flex items-center gap-3">
						<Profile
							className="w-12 h-12"
							style={{
								color:
									PROFILE_COLORS[
										friend.profileImgNumber as keyof typeof PROFILE_COLORS
									],
							}}
						/>

						<div className="flex flex-col">
							<span className="font-semibold text-xl">{friend.nickname}</span>
							<span className="text-[#494949] font-normal text-xl">
								{friend.handle}
							</span>
						</div>
					</div>

					<FollowButton
						friend={friend}
						onToggle={() => onUpdateFriend?.(friend)}
					/>
				</div>
			))}
		</div>
	);
}
