import Profile2 from "@/shared/assets/icons/profile2.svg?react";
import LevelProgressCircle from "@/entities/league/ui/LevelProgressCircle";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";

interface User {
	userId: number;
	nickname: string;
	level: number;
	xp: number;
	lp: number;
	rank: number;
	profileImgNumber: number;
}

interface UserListProps {
	users: User[];
	loading: boolean;
}

export default function UserRankList({ users, loading }: UserListProps) {
	return (
		<div className="flex flex-col w-full gap-2">
			{users.map((user) => {
				const profileBgColor =
					PROFILE_COLORS[user.profileImgNumber as keyof typeof PROFILE_COLORS];

				return (
					<div
						key={user.userId}
						className="flex flex-row w-full h-[103.77px] items-stretch justify-between border border-[#FFC1FC1A] backdrop-blur-[20px] rounded-xl overflow-hidden"
					>
						<div className="flex flex-row items-center gap-9 lg:px-5 px-6 bg-[#FFFFFF33] w-3/4">
							<span className="font-mbc text-[35.58px] font-medium w-12 text-left text-[#FFC1FC]">
								{String(user.rank).padStart(3, "0")}
							</span>
							<div className="flex w-14 h-14 items-center justify-center">
								<LevelProgressCircle xp={user.xp}>
									<Profile2
										className="w-[56px] h-[56px]"
										style={{ color: profileBgColor }}
									/>
								</LevelProgressCircle>
							</div>
							<span className="text-[35.58px] font-medium font-mbc text-white">
								{user.nickname}
							</span>
						</div>
						<div className="flex flex-col justify-center bg-[#FEF1FF40] w-1/4 min-w-[110px] px-4 py-2 text-[29.65px] -space-y-1 font-medium">
							<div className="flex flex-row items-center justify-start gap-4 pl-2">
								<span className="text-white w-6">LV</span>
								<span className="text-[#FFC1FC]">{user.level}</span>
							</div>
							<div className="flex flex-row items-center justify-start gap-4 pl-2">
								<span className="text-white w-6">LP</span>
								<span className="text-[#FFC1FC]">{user.lp}</span>
							</div>
						</div>
					</div>
				);
			})}
			{loading && <div className="text-center py-2">Loading...</div>}
		</div>
	);
}
