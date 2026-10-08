import { ChapterGrid } from '@/widgets/chapter-grid';
import { PageTitleBar } from '@/widgets/page-title-bar';

export function LearningPageNarrow() {
  return (
    <div
      data-slot="learning-page"
      data-layout="narrow"
      className="flex min-h-full flex-col bg-bg-1"
    >
      <PageTitleBar title="학습" />
      {/* 하단 탭 영역은 앱 셸이 확보한다. */}
      <main className="flex-1 px-4 pt-5 pb-4">
        <ChapterGrid size="sm" />
      </main>
    </div>
  );
}
