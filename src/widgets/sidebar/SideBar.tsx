import ProfileCard from "@/entities/user/ui/ProfileCard";
import FollowModalButton from "@/features/follow/FollowModalButton";
import Badges from "@/entities/badge/Badges";
import AddFriendButton from "@/features/friends/AddFriendButton";
import { useUserInfo } from "@/entities/sidebar/api/useUserInfo";
import { useBadges } from "@/entities/sidebar/api/useBadges";

export default function UserSidebar() {
	const {
		data: userInfo,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useUserInfo();
	const {
		data: userBadges,
		isLoading: isBadgesLoading,
		isError: isBadgesError,
	} = useBadges();

	if (isUserLoading || isBadgesLoading) {
		return (
			<div className="hidden w-1/4 lg:flex flex-col bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] z-10 p-4">
				Loading...
			</div>
		);
	}

	if (isUserError || !userInfo || isBadgesError || !userBadges) {
		return (
			<div className="hidden w-1/4 lg:flex flex-col bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] z-10 p-4">
				사용자 정보를 불러오지 못했습니다.
			</div>
		);
	}

	return (
		<div className="absolte hidden w-1/4 lg:flex flex-col bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] z-10">
			<ProfileCard userInfo={userInfo} />
			<FollowModalButton userInfo={userInfo} />
			<AddFriendButton />
			<p className="w-full h-[2px] bg-[#F2F2F2] mt-5 mb-3" />
			<Badges userBadges={userBadges} />
		</div>
	);
}
