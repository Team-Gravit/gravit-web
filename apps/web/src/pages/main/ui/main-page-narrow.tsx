import { ContinueLearningCard, RecentUnitCard } from '@/widgets/continue-learning';
import { DailyMission } from '@/widgets/daily-mission';
import { HeroGreeting, HeroProfileSummary } from '@/widgets/hero-greeting';
import { LearningStreak } from '@/widgets/learning-streak';

export function MainPageNarrow() {
  return (
    <div data-slot="main-page" data-layout="narrow" className="flex min-h-full flex-col bg-bg-2">
      <HeroGreeting>
        <HeroProfileSummary />
      </HeroGreeting>
      {/* 카드 열을 히어로와 38px 겹친다. 하단 탭 영역은 앱 셸이 확보한다. */}
      <main className="relative z-10 -mt-9.5 flex flex-1 flex-col gap-3 px-4 pb-4">
        <LearningStreak />
        <div data-slot="main-row-secondary" className="flex h-39 gap-3">
          <DailyMission layout="narrow" className="h-full min-w-0 flex-1" />
          <RecentUnitCard className="h-full min-w-0 flex-1" />
        </div>
        <ContinueLearningCard />
      </main>
    </div>
  );
}
