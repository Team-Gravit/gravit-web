import { ContinueLearningCard } from '@/widgets/continue-learning';
import { DailyMission } from '@/widgets/daily-mission';
import { GrowthSummary } from '@/widgets/growth-summary';
import { HeroGreeting } from '@/widgets/hero-greeting';
import { LearningStreak } from '@/widgets/learning-streak';
import { RecommendedUnits } from '@/widgets/recommended-units';

export function MainPageWide() {
  return (
    <div data-slot="main-page" data-layout="wide" className="flex min-h-full flex-col bg-bg-2">
      <HeroGreeting />
      {/* 데스크톱 시안의 1200px 본문 폭과 40px 열 간격을 유지한다. */}
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 gap-10 px-8 py-10 pb-50 xl:px-0">
        <div data-slot="main-column-primary" className="flex min-w-0 flex-1 flex-col gap-5">
          <GrowthSummary />
          <ContinueLearningCard />
          <RecommendedUnits />
        </div>
        <div data-slot="main-column-secondary" className="flex w-92 shrink-0 flex-col gap-5">
          <LearningStreak />
          <DailyMission layout="wide" />
        </div>
      </main>
    </div>
  );
}
