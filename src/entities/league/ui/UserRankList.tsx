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
		<div className="flex flex-col w-[80%] lg:w-full gap-2">
			{users.map((user) => {
				const profileBgColor =
					PROFILE_COLORS[user.profileImgNumber as keyof typeof PROFILE_COLORS];

				return (
					<div
						key={user.userId}
						className="flex flex-row w-full h-16 items-stretch justify-between border border-[#DCDCDC] rounded-xl overflow-hidden"
					>
						<div className="flex flex-row items-center gap-4 lg:px-3 px-6 bg-white w-3/4">
							<span
								className="font-mbc text-2xl font-medium w-12 text-left"
								style={{
									color: user.rank <= 3 ? "#BA00FF" : "#FFB608",
								}}
							>
								{String(user.rank).padStart(3, "0")}
							</span>
							<div className="flex w-14 h-14 h- items-center justify-center">
								<LevelProgressCircle xp={user.xp}>
									<Profile2
										className="w-10 h-10"
										style={{ color: profileBgColor }}
									/>
								</LevelProgressCircle>
							</div>
							<span className="text-2xl font-medium font-mbc">
								{user.nickname}
							</span>
						</div>
						<div className="flex flex-col justify-center bg-[#FEF2FF] w-1/4 min-w-[110px] px-4 py-2 text-[20px] -space-y-1 font-medium">
							<div className="flex flex-row items-center justify-start gap-1.5 pl-2">
								<span className="text-[#4C4C4C] w-6">LV</span>
								<span className="text-[#FF9500]">{user.level}</span>
							</div>
							<div className="flex flex-row items-center justify-start gap-1.5 pl-2">
								<span className="text-[#4C4C4C] w-6">LP</span>
								<span className="text-[#FF9500]">{user.lp}</span>
							</div>
						</div>
					</div>
				);
			})}
			{loading && <div className="text-center py-2">Loading...</div>}
		</div>
	);
}
