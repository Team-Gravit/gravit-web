import LevelProgressCircle from "@/entities/league/ui/LevelProgressCircle";
import Profile2 from "@/shared/assets/icons/profile2.svg?react";
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
	highlightUserId?: number;
}

export default function UserRankList({
	users,
	loading,
	highlightUserId,
}: UserListProps) {
	return (
		<div className="flex flex-col w-full gap-5">
			{users.map((user) => {
				const profileBgColor =
					PROFILE_COLORS[user.profileImgNumber as keyof typeof PROFILE_COLORS];

				const isHighlighted = highlightUserId === user.userId;

				return (
					<div
						key={user.userId}
						className={`flex flex-row items-stretch justify-between rounded-xl overflow-hidden
    ${isHighlighted ? "h-[105px] border-[1.48px] border-[#F479FF] shadow-[0_0_11.86px_0_#F479FF]" : "h-[85px] w-full border border-[#FFC1FC1A] backdrop-blur-[20px]"}
  `}
					>
						{/* 왼쪽 박스 */}
						<div
							className={`flex flex-row items-center px-6 w-3/4 ${isHighlighted ? "bg-white gap-14" : "bg-[#FFFFFF33] gap-9"}`}
						>
							<span
								className={`font-mbc font-medium text-left ${isHighlighted ? "text-[#FFB608] text-[42px]" : "text-[#FFC1FC] text-[35.58px]"} w-12`}
							>
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
							<span
								className={`font-mbc font-medium ${isHighlighted ? "text-black text-[42px]" : "text-white text-[35.58px]"}`}
							>
								{user.nickname}
							</span>
						</div>

						{/* 오른쪽 박스 */}
						<div
							className={`flex flex-col justify-center ${
								isHighlighted ? "bg-[#FEF1FF]" : "bg-[#FEF1FF40]"
							} w-1/4 min-w-[110px] px-4 py-2 font-medium`}
						>
							<div
								className={`flex flex-row items-center justify-start pl-2 ${
									isHighlighted ? "gap-6" : "gap-4"
								}`}
							>
								<span
									className={`${isHighlighted ? "text-[#5A5A5A] text-[36px]" : "text-white text-[29.65px]"} w-6`}
								>
									LV
								</span>
								<span
									className={`${isHighlighted ? "text-[#FF9500] text-[36px]" : "text-[#FFC1FC] text-[29.65px]"}`}
								>
									{user.level}
								</span>
							</div>
							<div
								className={`flex flex-row items-center justify-start pl-2 ${
									isHighlighted ? "gap-7" : "gap-4"
								}`}
							>
								<span
									className={`${isHighlighted ? "text-[#5A5A5A] text-[36px]" : "text-white text-[29.65px]"} w-6`}
								>
									LP
								</span>
								<span
									className={`${isHighlighted ? "text-[#FF9500] text-[36px]" : "text-[#FFC1FC] text-[29.65px]"}`}
								>
									{user.lp}
								</span>
							</div>
						</div>
					</div>
				);
			})}
			{loading && <div className="text-center py-2">Loading...</div>}
		</div>
	);
}
