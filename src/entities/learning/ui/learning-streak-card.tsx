import type { WeeklyLearningRecordResponse } from "@/shared/api";
import Card from "@/shared/ui/card/card";
import WeeklyStreak from "@/shared/ui/weekly-streak/weekly-streak";

type LearningStreakCardProps = {
	weeklyRecord?: WeeklyLearningRecordResponse;
	consecutiveSolvedDays?: number;
	className?: string;
};

export default function LearningStreakCard({
	weeklyRecord,
	consecutiveSolvedDays = 0,
	className,
}: LearningStreakCardProps) {
	return (
		<Card className={className}>
			<Card.Header>
				<Card.Title>연속 학습일</Card.Title>
				<Card.Link to="/league">자세히 보기</Card.Link>
			</Card.Header>
			<div className="w-full flex flex-col gap-2">
				{/**TODO : 디자인 파트에서 토큰 추가한다면 변경할 부분 */}
				<div className="flex items-baseline gap-[5px] text-text-1 font-medium text-base">
					<span className="text-[32px] font-semibold leading-none">
						{consecutiveSolvedDays}
					</span>
					일 연속
				</div>
				<WeeklyStreak weeklyRecord={weeklyRecord} />
			</div>
		</Card>
	);
}
