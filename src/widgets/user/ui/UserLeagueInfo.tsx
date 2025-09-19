import LevelProgressBar from "@/entities/user/ui/LevelProgressBar";
import StatusBadge from "@/entities/user/ui/StatusBadge";
import Cup from "@/shared/assets/icons/cup.svg?react";
import Xp from "@/shared/assets/icons/xp.svg?react";

export default function UserLeagueInfo({
	nickname,
	league,
	xp,
	level,
}: {
	nickname: string;
	league: string;
	xp: number;
	level: number;
}) {
	return (
		<>
			<h2 className="font-semibold text-[32px] mb-4">
				현재 <span className="font-bold">{nickname}</span>님의 티어는{" "}
				<span className="font-semibold text-[#ff9500]">
					{league || "브론즈"}
				</span>
				입니다!
			</h2>
			<section className="w-full flex flex-row items-center gap-2 h-[30px]">
				<StatusBadge
					icon={Cup}
					label={league}
					className={"h-full"}
					badgeBackground="var(--color-main-1)"
					textColor="var(--color-main-2)"
				/>
				<StatusBadge
					icon={Xp}
					label={`${xp} XP`}
					className={"h-full"}
					badgeBackground="var(--color-main-1)"
					textColor="var(--color-main-2)"
				/>

				<LevelProgressBar percent={74} level={level} />
			</section>
		</>
	);
}
