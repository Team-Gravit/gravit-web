import type { UserInfo } from "@/entities/sidebar/model/types";

interface Props {
	userInfo: UserInfo;
}

export default function FollowModalButton({ userInfo }: Props) {
	return (
		<div className="flex flex-row items-center justify-center mt-4 mb-4 gap-5 text-[#222222]/80 text-2xl">
			<div className="w-[146.5px] h-12 flex flex-row items-center justify-center border border-[#000000]/10 rounded-lg gap-2">
				팔로워 <span className="font-medium">{userInfo.follower}</span>
			</div>
			<div className="w-[146.5px] h-12 flex flex-row items-center justify-center border border-[#000000]/10 rounded-lg gap-2">
				팔로잉 <span className="font-medium">{userInfo.following}</span>
			</div>
		</div>
	);
}
