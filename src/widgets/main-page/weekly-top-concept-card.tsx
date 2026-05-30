import Card from "@/shared/ui/card/card";
import ProgressBar from "@/shared/ui/progress-bar/progress-bar";

export default function WeeklyTopConceptCard() {
	const MOCK_DATA = [
		{ concept: "자료구조", count: 14 },
		{ concept: "자료구조", count: 14 },
		{ concept: "자료구조", count: 14 },
	];
	return (
		<Card className="gap-4">
			<div className="flex flex-col gap-2">
				<Card.Title>이번 주 가장 많이 푼 챕터</Card.Title>
				<h3 className="text-text-1 text-headline2 md:text-title3">
					어떤 주제에 집중했나요?
				</h3>
			</div>
			<ol className="w-full flex flex-col gap-3">
				{MOCK_DATA.map((data, idx) => (
					<TopConceptItem key={`weakness-${idx}`} {...data} num={idx + 1} />
				))}
			</ol>
		</Card>
	);
}

// props명 변경 예정
function TopConceptItem({
	num,
	concept,
	count,
}: {
	num: number;
	concept: string;
	count: number;
}) {
	return (
		<li className="w-full flex gap-3 md:gap-4 items-center bg-gray-200 rounded-lg p-4 md:py-5">
			{/** TODO: 타이포그래피 토큰 없음 */}
			<div className="size-8 rounded-full bg-gray-800 text-text-1-w font-medium text-base flex items-center justify-center">
				{num}
			</div>
			<div className="flex-1 flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<span className="text-text-2 text-headline2 md:text-heading2">
						{concept}
					</span>
					<span className="text-text-2 text-body1-normal">{count}개</span>
				</div>
				<ProgressBar value={30} />
			</div>
		</li>
	);
}
