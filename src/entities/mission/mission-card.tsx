import type { MissionRoutePath } from "@/entities/mission/lib/get-mission-url";
import type { MissionDetail } from "@/entities/mission/model/schema";
import { LinkButton } from "@/shared/ui/button/link-button";
import Card from "@/shared/ui/card/card";
import LabeledProgressBar from "@/shared/ui/progress-bar/labeled-progress-bar";

export default function MissionCard({
	missionDetail,
	className,
}: {
	missionDetail: MissionDetail & { url: MissionRoutePath };
	className?: string;
}) {
	const { awardXp, progressRate, missionDescription } = missionDetail;
	return (
		<Card className={className}>
			<Card.Header>
				<Card.Title>오늘의 미션</Card.Title>
			</Card.Header>
			<div className="flex flex-col justify-between md:gap-2">
				<div>
					<h3 className="text-text-1 text-headline2 md:text-title3 leading-none">
						{missionDescription}
					</h3>
					<span className="text-main text-caption1">완료 시 + {awardXp}XP</span>
				</div>
				<div className="flex flex-col gap-3">
					<LabeledProgressBar
						value={progressRate * 100}
						label="진행률"
						labelClassName="text-gray-500 text-caption2 md:text-caption1"
					/>
				</div>
			</div>
			<LinkButton display="block" to={missionDetail.url}>
				도전하러 가기
			</LinkButton>
		</Card>
	);
}
