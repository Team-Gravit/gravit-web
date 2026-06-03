import Chip from "@/shared/ui/chip/chip";
import Card from "@/shared/ui/card/card";
import type { WeakConceptResponse } from "@/shared/api/@generated/model";
import { transformWeaknessConcept } from "../lib/transform-weakness-concept";

export default function WeaknessConceptsCard({data}: {data: WeakConceptResponse[]}) {

	const weaknessData = transformWeaknessConcept(data);
	return (
		<Card className="gap-4">
			<div className="flex flex-col gap-2">
				<Card.Title>이번 주 가장 많이 푼 챕터</Card.Title>
				<h3 className="text-text-1 text-headline2 md:text-title3">
					어떤 주제에 집중했나요?
				</h3>
			</div>
			{weaknessData.length > 0 ? (<ol className="w-full flex flex-col gap-3">
				{weaknessData.map((data,idx) => (
					<WeaknessConceptItem
						key={data.id}
						num={idx + 1}
						{...data}
					/>
				))}
			</ol>) : <div>이번 주 학습 기록이 없습니다</div>}
		</Card>
	);
}

function WeaknessConceptItem({
	num,
	title,
	description,
	percent
}: {
	num: number;
	title: string;
	description: string;
	percent: number;
}) {
	return (
		<li className="w-full flex gap-3 md:gap-4 items-center bg-gray-200 rounded-lg px-4 py-3">
			{/** TODO: 타이포그래피 토큰 없음 */}
			<div className="flex items-center gap-3 flex-1">
				<div className="size-8 rounded-full bg-gray-800 text-text-1-w font-medium text-base flex items-center justify-center">
					{num}
				</div>
				<div className="flex-1 flex flex-col gap-0.5 md:gap-2">
					<span className="text-text-2 text-label1 md:text-heading2">
						{title}
					</span>
					<span className="text-text-4 text-label2 md:text-label1">
						{description}
					</span>
				</div>
			</div>
			<Chip variant="outlined" size="sm">
				{percent}%
			</Chip>
		</li>
	);
}
