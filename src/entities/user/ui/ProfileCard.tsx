import type { UserInfo } from "@/entities/sidebar/model/types";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";

interface Props {
	userInfo: UserInfo;
}

export default function ProfileCard({ userInfo }: Props) {
	const profileBgColor =
		PROFILE_COLORS[userInfo.profileImgNumber as keyof typeof PROFILE_COLORS];

	return (
		<section className="flex flex-col items-center px-8 py-4">
			<Profile style={{ color: profileBgColor }} className="w-36 h-36" />
			<h3 className="mt-4 text-[32px] font-semibold text-[#222222]">
				{userInfo.nickname}
			</h3>
			<span className="mt-1.5 text-xl text-[#222222]/80">
				@{userInfo.handle}
			</span>
		</section>
	);
}
