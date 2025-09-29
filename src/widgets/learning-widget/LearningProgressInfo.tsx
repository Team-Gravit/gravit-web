import LevelProgressBar from "@/entities/user/ui/LevelProgressBar";
import StatusBadge from "@/entities/user/ui/StatusBadge";
import Cup from "@/shared/assets/icons/cup.svg?react";
import Xp from "@/shared/assets/icons/xp.svg?react";

export default function LearningProgressInfo({
	league,
	xp,
	level,
}: {
	league: string;
	xp: number;
	level: number;
}) {
	return (
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
	);
}
