import {
  InterviewBanner,
  InterviewSummaryCard,
  RecentSessionsCard,
  ScoreTrendCard,
  WeakTopicsCard,
} from '@/widgets/interview-dashboard';

export function InterviewPageNarrow() {
  return (
    <div
      data-slot="interview-page"
      data-layout="narrow"
      className="flex min-h-full flex-col bg-bg-2"
    >
      <InterviewBanner layout="narrow" />
      <main className="flex flex-1 flex-col gap-3 p-4">
        <InterviewSummaryCard layout="narrow" />
        <RecentSessionsCard />
        <WeakTopicsCard />
        <ScoreTrendCard />
      </main>
    </div>
  );
}
