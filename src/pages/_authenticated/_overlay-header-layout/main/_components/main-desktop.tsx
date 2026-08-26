import HeroSection from '@/shared/ui/hero/hero-section';
import ContinueLearningSection from '@/widgets/main-page/continue-learning-section';
import GrowthSection from '@/widgets/main-page/growth-section';
import MainGreeting from '@/widgets/main-page/main-greeting';
import MissionSection from '@/widgets/main-page/mission-section';
import RecommendedUnitsSection from '@/widgets/main-page/recommended-units-section';
import StreakSection from '@/widgets/main-page/streak-section';

export default function MainDesktop() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeroSection>
        <HeroSection.Content className="text-white">
          <MainGreeting variant="desktop" />
        </HeroSection.Content>
      </HeroSection>
      <main style={{ paddingBottom: 200 }} className="w-full flex-1 bg-bg-2">
        <div className="md:py-0 p-8 mx-auto">
          <div className="w-full md:max-w-[1200px] flex h-full mx-auto gap-x-10 py-10">
            <div className="flex flex-col gap-5 col-span-2 flex-1">
              <GrowthSection />
              <ContinueLearningSection />
              <RecommendedUnitsSection />
            </div>
            <div className="flex flex-col gap-5 col-span-1 w-[360px]">
              <StreakSection />
              <MissionSection className="h-[254px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
