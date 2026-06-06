import { createFileRoute } from '@tanstack/react-router';

import { useGetMyPageSummary } from '@/shared/api/@generated/mypage-api/mypage-api';
import StudyHeatmap from '@/widgets/my-page/summary/study-heatmap';
import SummaryCard from '@/widgets/my-page/summary/summary-card';

export const Route = createFileRoute('/_authenticated/my/_profile-layout/summary')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useGetMyPageSummary();

  if (isPending || isError) return;

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <SummaryCard learningSummary={data.learningSummary} />
      <StudyHeatmap availableYears={data.years} />
    </div>
  );
}
