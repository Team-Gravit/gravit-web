import { cn } from "@/shared/lib/cn";
import useResponsive from "@/shared/model/use-responsive";
import CalendarHeatmap from "@/shared/ui/calendar-heatmap/calendar-heatmap";
import { HEATMAP_COLOR_LEVELS } from "@/shared/ui/calendar-heatmap/calendar-heatmap.constants";
import { createMockYearHeatmapData } from "@/shared/ui/calendar-heatmap/calendar-heatmap.mock";
import Card from "@/shared/ui/card/card";
import { useMemo } from "react";

export default function StudyHeatmap() {
	const { isMobile } = useResponsive();

	// TODO: 서버 데이터 호출로 수정할 부분
	const mock_values = useMemo(() => createMockYearHeatmapData(), []);

	return (
		<Card className="md:px-8 md:py-7 gap-4 bg-white">
			<div className="flex justify-between items-center">
				<span className="text-label2 md:text-body1-reading text-text-4">
					학습 기록
				</span>
			</div>
			<div className="bg-divider-1 h-[1px] w-full" />

			{/** TODO: half-year를 쓰긴 할건지 디자이너분과 합의 필요 */}
			<CalendarHeatmap
				values={mock_values}
				range={isMobile ? "half-year" : "year"}
			/>
			<div className="w-full flex items-center justify-end text-caption1 md:text-body1-normal text-text-3 gap-2 md:gap-4">
				<span>적음</span>
				<ol
					key={"heatmap-color-info"}
					className="flex items-center gap-1 md:gap-2"
				>
					{HEATMAP_COLOR_LEVELS.map((color, index) => (
						<li
							key={index}
							className={cn(
								"size-3 md:size-4 rounded-xs md:rounded-sm bg-bg-1",
								color,
							)}
						></li>
					))}
				</ol>
				<span>많음</span>
			</div>
			<div className="p-3 md:px-6 md:py-4 rounded-sm md:rounded-lg border border-bg-3 text-text-3 text-caption1">
				주로 10시에 학습하시네요.
			</div>
		</Card>
	);
}
