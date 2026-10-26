import { useRefetchActiveQueries } from '@/shared/api';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
import { ChapterGrid } from '@/widgets/chapter-grid';
import { PageTitleBar } from '@/widgets/page-title-bar';

export function LearningPageNarrow() {
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    <div
      data-slot="learning-page"
      data-layout="narrow"
      className="flex min-h-full flex-col bg-bg-1"
    >
      <PageTitleBar title="학습" />
      {/* 제목 막대는 두고 그 아래만 내려간다. 하단 탭 영역은 앱 셸이 확보한다. */}
      <PullToRefresh onRefresh={refetchActiveQueries} className="flex-1">
        <main className="flex-1 px-4 pt-5 pb-4">
          <ChapterGrid size="sm" />
        </main>
      </PullToRefresh>
    </div>
  );
}
