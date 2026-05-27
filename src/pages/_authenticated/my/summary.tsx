import { createFileRoute } from "@tanstack/react-router";
import SummaryCard from "@/widgets/my-page/summary/summary-card";
import StudyHeatmap from "@/widgets/my-page/summary/study-heatmap";

export const Route = createFileRoute("/_authenticated/my/summary")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-3 md:gap-6">
			<SummaryCard />
			<StudyHeatmap />
		</div>
	);
}
