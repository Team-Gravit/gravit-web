import DailyCompletedLessonsCard from "@/entities/learning/ui/learning-state/completed-lessons/daily-completed-lessons";
import { useGetMyPageLearning } from "@/shared/api/@generated/mypage-api/mypage-api";
import WeaknessConceptsCard from "@/entities/learning/ui/weakness-concepts-card";
import WeeklyTopConceptCard from "@/entities/learning/ui/learning-state/completed-lessons/weekly-top-concept-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/_profile-layout/learning")({
	component: RouteComponent,
});

function RouteComponent() {

	const {data, isPending, isError} = useGetMyPageLearning();
	if(isPending || isError) return;

	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
				<DailyCompletedLessonsCard data={data.weeklyReport}/>
				<WeeklyTopConceptCard data={data.topChapters}/>
			</div>
			<WeaknessConceptsCard data={data.weakConcepts}/>
		</div>
	)
}
