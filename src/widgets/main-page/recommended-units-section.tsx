import type { RecommendedUnit } from "@/entities/learning/model/schema";
import UnitCard from "@/features/learning/ui/unit-card";
import Card from "@/shared/ui/card/card";

export default function RecommendedUnitsSection({
	units,
}: {
	units: RecommendedUnit[];
}) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>새 주제 시작하기</Card.Title>
				<Card.Link to="./">전체 보기</Card.Link>
			</Card.Header>
			<div className="w-full flex-1 grid grid-cols-2 gap-4">
				{units.map((unit) => (
					<UnitCard
						key={unit.unitId}
						title={unit.chapterTitle}
						lessonNum={unit.unitId}
						chapterId={unit.chapterId}
					/>
				))}
			</div>
		</Card>
	);
}
