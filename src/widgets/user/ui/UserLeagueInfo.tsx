import { getLeagueColorClass } from "@/entities/learning/lib/getLeagueColor";
import LearningProgressInfo from "@/widgets/learning-widget/LearningProgressInfo";

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
	const leagueColor = getLeagueColorClass(league);

	return (
		<>
			<h2 className="font-semibold text-[32px] mb-4">
				현재 <span className="font-bold">{nickname}</span>님의 리그는{" "}
				<span className={`font-semibold ${leagueColor}`}>
					{league || "브론즈"}
				</span>
				입니다!
			</h2>
			<LearningProgressInfo league={league} xp={xp} level={level} />
		</>
	);
}
