import Card from "@/shared/ui/card/card";
import UnitListScrollArea from "./unit-list-scroll-area";
import LabeledProgressBar from "@/shared/ui/progress-bar/labeled-progress-bar";

export default function UnitListCard({
	units,
}: {
	units: {
		id: number;
		title: string;
		status: "completed" | "inProgress" | "notStarted";
	}[];
}) {
	return (
		<Card className="px-0 md:px-0">
			<Card.Header className="px-3 md:px-5">
				<Card.Title>이어서 학습하기</Card.Title>
				<Card.Link to="/units">전체 학습화면 보기</Card.Link>
			</Card.Header>
			<div className="w-full px-3 md:px-5">
				<LabeledProgressBar
					label={
						<h3 className="text-[#242424] font-semibold text-base md:text-2xl">
							자료구조
						</h3>
					}
					value={20}
				/>
			</div>
			<UnitListScrollArea units={units} />
		</Card>
	);
}
