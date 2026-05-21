import type { UnitProgress } from "@/entities/learning/model/schema";
import { LinkButton } from "@/shared/ui/button/link-button";
import Card from "@/shared/ui/card/card";
import LabeledProgressBar from "@/shared/ui/progress-bar/labeled-progress-bar";
import UnitListScrollArea from "./unit-list-scroll-area";

export default function UnitListCard({
	chapterId,
	chapterTitle,
	chapterProgressRate,
	units,
}: {
	chapterId: number;
	chapterTitle: string;
	chapterProgressRate: number;
	units: UnitProgress[];
}) {
	const nextUnit = units.find((u) => !u.isCompleted);

	return (
		<Card className="px-0 md:px-0">
			<Card.Header className="px-3 md:px-5">
				<Card.Title>이어서 학습하기</Card.Title>
				{nextUnit && (
					<Card.Link
						to="/learning/$chapterId/$unitId"
						params={{
							chapterId: String(chapterId),
							unitId: String(nextUnit.unitId),
						}}
					>
						전체 학습화면 보기
					</Card.Link>
				)}
			</Card.Header>
			<div className="w-full px-3 md:px-5">
				<LabeledProgressBar label={chapterTitle} value={chapterProgressRate} />
			</div>
			<UnitListScrollArea units={units} />
			<div className="w-full px-3 md:px-5">
				{nextUnit && (
					<LinkButton
						to="/learning/$chapterId/$unitId"
						display="block"
						params={{
							chapterId: String(chapterId),
							unitId: String(nextUnit.unitId),
						}}
						className=""
					>
						이어서 학습하기
					</LinkButton>
				)}
			</div>
		</Card>
	);
}
