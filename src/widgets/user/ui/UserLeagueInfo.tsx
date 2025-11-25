import { getLeagueColorClass } from "@/entities/learning/lib/getLeagueColor";
import LearningProgressInfo from "@/widgets/learning-widget/LearningProgressInfo";

export default function UserLeagueInfo({
	nickname,
	league,
	xp,
	level,
	statusText = "현재",
}: {
	nickname: string;
	league: string;
	xp: number;
	level: number;
	statusText?: string;
}) {
	const leagueColor = getLeagueColorClass(league);

	return (
		<>
			<h2 className="font-semibold text-[40px] mb-5">
				{statusText} <span className="font-bold">{nickname}</span>님의 리그는{" "}
				<span className={`font-semibold ${leagueColor}`}>
					{league || "브론즈"}
				</span>
				입니다!
			</h2>
			<LearningProgressInfo league={league} xp={xp} level={level} />
		</>
	);
}
