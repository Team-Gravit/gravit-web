import { createFileRoute } from "@tanstack/react-router";
import SummaryCard from "@/widgets/my-page/summary/summary-card";
import StudyHeatmap from "@/widgets/my-page/summary/study-heatmap";
import { useGetMyPageSummary } from "@/shared/api/@generated/mypage-api/mypage-api";

export const Route = createFileRoute("/_authenticated/my/_profile-layout/summary")({
	component: RouteComponent,
});

function RouteComponent() {

	const {data, isPending, isError} = useGetMyPageSummary();

	if(isPending || isError) return;

	return (
		<div className="flex flex-col gap-3 md:gap-6">
			<SummaryCard learningSummary={data.learningSummary}/>
			<StudyHeatmap/>
		</div>
	)
}
