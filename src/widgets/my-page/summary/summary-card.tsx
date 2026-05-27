import useResponsive from "@/shared/model/use-responsive";
import Card from "@/shared/ui/card/card";
import CrownIcon from "@/shared/assets/icons/crown-icon.svg?react";

export default function SummaryCard() {
	// TODO: 실제 데이터 받아오면 수정할 부분들
	const { isMobile } = useResponsive();
	return (
		<Card className="w-full py-4 md:py-[33px] px-0 md:px-4">
			<div className="flex flex-col gap-2 items-center md:hidden">
				<div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center">
					<CrownIcon />
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-title3 text-main-1">상위 4%</h3>
					<span className="text-caption1 text-text-4">전체 학습 순위</span>
				</div>
			</div>
			<div className="w-full flex flex-row items-center gap-0 px-4 py-3 md:px-0 md:py-0">
				{!isMobile && <SummaryCardItem value="4%" label="학습률 상위" />}
				<SummaryCardItem value="14개" subValue="/ 14개" label="완료 레슨" />
				<SummaryCardItem value="100.5h" label="총 학습시간" />
				<SummaryCardItem value="82%" label="평균 정답률" />
			</div>
		</Card>
	);
}

interface SummaryCardItemProps {
	value: string;
	subValue?: string;
	label: string;
}

function SummaryCardItem({ value, subValue, label }: SummaryCardItemProps) {
	return (
		<div className="flex flex-col items-center gap-1 flex-1 border-l border-gray-300 first:border-none">
			<h3 className="text-headline2 md:text-title1 text-text-1 flex gap-1 items-baseline">
				{value}
				{subValue && (
					<span className="text-caption1 md:text-title3 text-text-4">
						{subValue}
					</span>
				)}
			</h3>

			<div className="text-caption1 md:text-body1-normal text-text-4">
				{label}
			</div>
		</div>
	);
}
