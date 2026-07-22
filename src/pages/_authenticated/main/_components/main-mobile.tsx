import { BOTTOM_TAB_BAR_HEIGHT } from '@/shared/config/constants';
import HeroSection from '@/shared/ui/hero/hero-section';
import BottomTabBar from '@/widgets/bottom-tab-bar/bottom-tab-bar';
import ContinueLearningSection from '@/widgets/main-page/continue-learning-section';
import MainGreeting from '@/widgets/main-page/main-greeting';
import MissionSection from '@/widgets/main-page/mission-section';
import RecentUnitSection from '@/widgets/main-page/recent-unit-section';
import StreakSection from '@/widgets/main-page/streak-section';

export default function MainMobile() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-bg-2">
      <HeroSection>
        <HeroSection.Content className="text-white">
          <MainGreeting variant="mobile" />
        </HeroSection.Content>
      </HeroSection>
      <main style={{ paddingBottom: BOTTOM_TAB_BAR_HEIGHT }} className="w-full flex-1 -mt-14 z-15">
        <div className="p-4 md:py-0">
          <div className="w-full flex flex-col gap-4">
            <StreakSection />

            <div className="flex h-[156px] w-full gap-4">
              <MissionSection className="h-full min-w-0 flex-1" />
              <RecentUnitSection className="h-full min-w-0 flex-1" />
            </div>

            <ContinueLearningSection />
          </div>
        </div>
      </main>
      <BottomTabBar />
    </div>
  );
}
