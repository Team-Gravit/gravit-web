import {
  InterviewBanner,
  InterviewSummaryCard,
  RecentSessionsCard,
  ScoreTrendCard,
  WeakTopicsCard,
} from '@/widgets/interview-dashboard';

export function InterviewPageWide() {
  return (
    <div data-slot="interview-page" data-layout="wide" className="flex min-h-full flex-col bg-bg-2">
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-8 pt-10 pb-50 xl:px-0">
        <div className="grid grid-cols-[804fr_372fr] gap-6">
          <InterviewBanner layout="wide" />
          <InterviewSummaryCard layout="wide" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <WeakTopicsCard />
          <RecentSessionsCard />
        </div>
        <ScoreTrendCard />
      </main>
    </div>
  );
}
