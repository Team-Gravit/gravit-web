import WeaknessConceptsCard from "@/widgets/main-page/weakness-concepts-card";
import WeeklyTopConceptCard from "@/widgets/main-page/weekly-top-concept-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/_profile-layout/learning")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
				<div>일별 완료 레슨 수</div>
				<WeeklyTopConceptCard />
			</div>
			<WeaknessConceptsCard />
		</div>
	)
}
