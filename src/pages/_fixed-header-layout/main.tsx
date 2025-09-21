import Banner from "@/shared/ui/banner/Banner";
import { StatCard } from "@/shared/ui/card/StatCard";
import Footer from "@/widgets/footer/Footer";
import MissionCard from "@/widgets/misson-widget/MissionCard";
import { createFileRoute } from "@tanstack/react-router";
import rocket from "@/shared/assets/images/rocket.png";
import fire from "@/shared/assets/images/fire.png";
import RecentLearningCard from "@/widgets/learning-widget/RecentLearningCard";
import UserLeagueInfo from "@/widgets/user/ui/UserLeagueInfo";

const data = {
	nickname: "땅콩",
	level: 4,
	xp: 100,
	league: "브론즈",
	recentLearningSummaryResponse: {
		chapterId: 1,
		chapterName: "자료구조",
		totalUnits: 10,
		completedUnits: 2,
	},
};

export const Route = createFileRoute("/_fixed-header-layout/main")({
	component: MainPage,
});

function MainPage() {
	return (
		<>
			<main className="flex-grow flex flex-col items-center justify-center bg-gray-200">
				<Banner />
				<div className="w-full max-w-[1700px] flex-grow p-20 bg-[#f2f2f2] flex flex-col lg:flex-row gap-6">
					<section className="w-full lg:w-1/2 flex flex-col">
						<UserLeagueInfo
							nickname={data.nickname}
							league={data.league}
							xp={5}
							level={3}
						/>

						<div className="flex flex-row gap-4 mt-8">
							<MissionCard />
							<aside className="flex flex-col w-1/3 min-h-[334px] gap-8">
								<dl className="flex flex-col gap-4 flex-grow">
									<StatCard icon={rocket} label={"행성 정복률"} value={"15%"} />
									<StatCard icon={fire} label={"연속 학습일"} value={"3일"} />
								</dl>
							</aside>
						</div>
					</section>
					<section className="w-full lg:w-1/2 flex flex-col">
						<h2 className="font-semibold text-[32px] mb-4">최근 진행한 학습</h2>
						<RecentLearningCard
							chapterSummary={data.recentLearningSummaryResponse}
						/>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}
