import HeroSection from "@/shared/ui/hero/hero-section";
import { type MainPageViewModel } from "../main.model";
import LearningStreakCard from "@/entities/learning/ui/learning-streak-card";
import MissionCard from "@/entities/mission/mission-card";
import UnitListCard from "@/widgets/main-page/unit-list-card";
import UserProgressBar from "@/widgets/main-page/user-progress-bar";
import RecommendedUnitsSection from "@/widgets/main-page/recommended-units-section";
import Header from "@/widgets/header/ui/_header";

export default function MainDesktop({ vm }: { vm: MainPageViewModel }) {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<Header />
			<HeroSection>
				<HeroSection.Content className="text-white">
					<p className="text-4xl mb-2 font-semibold">
						어서오세요, {vm.progress.nickname}님!
					</p>
					<p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
				</HeroSection.Content>
			</HeroSection>
			<main style={{ paddingBottom: 200 }} className="w-full flex-1 bg-bg-2">
				<div className="md:py-0">
					<div className="w-full md:max-w-[1200px] flex h-full mx-auto gap-x-10 py-10">
						<div className="flex flex-col gap-5 col-span-2 flex-1">
							<UserProgressBar user={vm.progress} rank={vm.progress} />
							<UnitListCard
								chapterId={vm.units.chapterId}
								chapterTitle={vm.units.chapterTitle}
								chapterProgressRate={vm.units.chapterProgressRate}
								units={vm.units.items}
							/>
							<RecommendedUnitsSection units={vm.recommendedUnits} />
						</div>
						<div className="flex flex-col gap-5 col-span-1">
							<LearningStreakCard
								weeklyRecord={vm.streak.weeklyRecord}
								consecutiveSolvedDays={vm.streak.consecutiveSolvedDays}
							/>
							{vm.mission && <MissionCard missionDetail={vm.mission} />}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
