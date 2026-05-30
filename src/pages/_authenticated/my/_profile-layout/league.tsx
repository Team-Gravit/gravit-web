import SectionCard from "@/shared/ui/card/section-card";
import LeagueHistoryChart from "@/widgets/user/league/ui/league-history-chart";
import LeagueStatSection from "@/widgets/user/league/ui/league-stat-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/my/_profile-layout/league",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SectionCard title="리그 시즌 히스토리" description="시즌별 최종 티어 기록">
			<div className="mb-7 md:mb-0">
				<LeagueStatSection />
			</div>
			<LeagueHistoryChart />
		</SectionCard>
	);
}
