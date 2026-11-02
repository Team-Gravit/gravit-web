import { useRefetchActiveQueries } from '@/shared/api';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
import { ContinueLearningCard } from '@/widgets/continue-learning';
import { DailyMission } from '@/widgets/daily-mission';
import { HeroGreeting, HeroProfileSummary } from '@/widgets/hero-greeting';
import { LearningStreak } from '@/widgets/learning-streak';
import { RecommendedUnitCard } from '@/widgets/recommended-units';

/*
  당겨서 새로고침할 때 히어로 위로 드러나는 배경.
  475×304 그림 상자의 윗변 색을 가로로 펼친다. 정지점은 303.01deg 그라데이션의
  윗변을 90deg로 환산한 값이며, 그림 상자가 닿지 않는 왼쪽은 --color-space-end로 채운다.
*/
const PULL_TO_REFRESH_BACKGROUND =
  'linear-gradient(90deg, var(--color-space-end) 6.97%, var(--color-space-start) 136.5%) right top / max(100%, 475px) 100% no-repeat var(--color-space-end)';

export function MainPageNarrow() {
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    <div className="flex min-h-full flex-col" style={{ background: PULL_TO_REFRESH_BACKGROUND }}>
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
