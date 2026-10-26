import { useRefetchActiveQueries } from '@/shared/api';
import { SPACE_TOP_COLOR } from '@/shared/config';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
import { ContinueLearningCard } from '@/widgets/continue-learning';
import { DailyMission } from '@/widgets/daily-mission';
import { HeroGreeting, HeroProfileSummary } from '@/widgets/hero-greeting';
import { LearningStreak } from '@/widgets/learning-streak';
import { RecommendedUnitCard } from '@/widgets/recommended-units';

export function MainPageNarrow() {
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    // 당겨서 새로고침할 때 히어로 위로 드러나는 바탕을 상단 색과 맞춘다.
    <div className="flex min-h-full flex-col" style={{ backgroundColor: SPACE_TOP_COLOR }}>
      <PullToRefresh onRefresh={refetchActiveQueries} className="flex-1" isUnderStatusBar>
        <div data-slot="main-page" data-layout="narrow" className="flex flex-1 flex-col bg-bg-2">
          <HeroGreeting>
            <HeroProfileSummary />
          </HeroGreeting>
          {/* 하단 탭 영역의 여백은 앱 셸에서 확보한다. */}
          <main className="relative z-10 -mt-9.5 flex flex-1 flex-col gap-3 px-4 pb-4">
            <LearningStreak />
            <div data-slot="main-row-secondary" className="flex h-39 gap-3">
              <DailyMission layout="narrow" className="h-full min-w-0 flex-1" />
              <RecommendedUnitCard className="h-full min-w-0 flex-1" />
            </div>
            <ContinueLearningCard />
          </main>
        </div>
      </PullToRefresh>
    </div>
  );
}
