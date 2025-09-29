import Banner from "@/shared/ui/banner/Banner";
import { StatCard } from "@/shared/ui/card/StatCard";
import MissionCard from "@/widgets/misson-widget/MissionCard";
import { createFileRoute } from "@tanstack/react-router";
import rocket from "@/shared/assets/images/rocket.png";
import fire from "@/shared/assets/images/fire.png";
import RecentLearningCard from "@/widgets/learning-widget/RecentLearningCard";
import UserLeagueInfo from "@/widgets/user/ui/UserLeagueInfo";
import Footer from "@/widgets/Footer/Footer";
import { useFetchMainInfo } from "@/widgets/main/model/hooks";

export const Route = createFileRoute("/_fixed-header-layout/main")({
	component: MainPage,
});

function MainPage() {
	const { data, isFetching, isError, error } = useFetchMainInfo();

	if (isFetching) {
		return <div>로딩중</div>;
	}

	if (isError) {
		return <>{error.message}</>;
	}

	if (!data) {
		return <div>데이터 없음</div>;
	}

	const {
		nickname,
		xp,
		leagueName,
		planetConquestRate,
		consecutiveDays,
		level,
		missionName,
		awardXp,
		...recentLearningSummary
	} = data;

	return (
		<>
			<main className="flex-grow flex flex-col items-center justify-center bg-gray-200">
				<Banner />
				<div className="w-full max-w-[1700px] flex-grow p-20 bg-[#f2f2f2] flex flex-col lg:flex-row gap-6">
					<section className="w-full lg:w-1/2 flex flex-col">
						<UserLeagueInfo
							nickname={nickname}
							league={leagueName}
							xp={xp}
							level={level}
						/>

						<div className="flex flex-row gap-4 mt-8">
							<MissionCard missionInfo={{ missionName, awardXp }} />
							<aside className="flex flex-col w-1/3 min-h-[334px] gap-8">
								<dl className="flex flex-col gap-4 flex-grow">
									<StatCard
										icon={rocket}
										label={"행성 정복률"}
										value={`${planetConquestRate}%`}
									/>
									<StatCard
										icon={fire}
										label={"연속 학습일"}
										value={`${consecutiveDays}일`}
									/>
								</dl>
							</aside>
						</div>
					</section>
					<section className="w-full lg:w-1/2 flex flex-col">
						<h2 className="font-semibold text-[32px] mb-4">최근 진행한 학습</h2>
						<RecentLearningCard chapterSummary={recentLearningSummary} />
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}
