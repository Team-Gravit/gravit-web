import BottomTabBar from "@/widgets/bottom-tab-bar/bottom-tab-bar";
import HeroSection from "@/shared/ui/hero/hero-section";
import { BOTTOM_TAB_BAR_HEIGHT } from "@/shared/config/constants";
import { type MainPageViewModel } from "../main.model";
import LearningStreakCard from "@/entities/learning/ui/learning-streak-card";
import UnitCard from "@/features/learning/ui/unit-card";
import MissionCard from "@/entities/mission/mission-card";
import UnitListCard from "@/widgets/main-page/unit-list-card";

export default function MainMobile({ vm }: { vm: MainPageViewModel }) {
	return (
		<div className="flex flex-col min-h-screen w-full bg-bg-2">
			<HeroSection>
				<HeroSection.Content className="text-white">
					<p className="text-title3 mb-1">
						어서오세요, {vm.progress.nickname}님!
					</p>
					<p className="text-body1-normal">
						그래빗과 함께 CS 지식을 마스터해요!
					</p>
				</HeroSection.Content>
			</HeroSection>
			<main
				style={{ paddingBottom: BOTTOM_TAB_BAR_HEIGHT }}
				className="w-full flex-1 -mt-14 z-15"
			>
				<div className="p-4 md:py-0">
					<div className="w-full flex flex-col gap-4">
						<LearningStreakCard
							weeklyRecord={vm.streak.weeklyRecord}
							consecutiveSolvedDays={vm.streak.consecutiveSolvedDays}
						/>
						<div className="w-full flex gap-4 h-[195px]">
							{vm.mission && (
								<MissionCard
									className="flex-1 h-full"
									missionDetail={vm.mission}
								/>
							)}
							{vm.units.items[0] && (
								<UnitCard
									className="flex-1 h-full"
									title={vm.units.items[0].title}
									lessonNum={vm.units.items[0].unitId}
									chapterId={vm.units.items[0].unitId}
								/>
							)}
						</div>
						<UnitListCard
							chapterId={vm.units.chapterId}
							chapterTitle={vm.units.chapterTitle}
							chapterProgressRate={vm.units.chapterProgressRate}
							units={vm.units.items}
						/>
					</div>
				</div>
			</main>
			<BottomTabBar />
		</div>
	);
}
