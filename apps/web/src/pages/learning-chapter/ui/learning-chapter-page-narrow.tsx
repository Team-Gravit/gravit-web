import { SpaceBackground } from '@/shared/ui/layout';
import { useUnitsInChapter } from '@/entities/learning';
import { PageTitleBar } from '@/widgets/page-title-bar';
import { ChapterHeading } from '@/widgets/chapter-heading';
import { UnitList } from '@/widgets/unit-list';

export interface LearningChapterPageNarrowProps {
  chapterId: number;
}

export function LearningChapterPageNarrow({ chapterId }: LearningChapterPageNarrowProps) {
  // 위젯과 queryKey를 공유해 추가 요청 없이 상단 바 제목을 읽는다.
  const { data } = useUnitsInChapter(chapterId);

  return (
    <SpaceBackground variant="starfield" className="bg-bg-1">
      <div
        data-slot="learning-chapter-page"
        data-layout="narrow"
        className="flex min-h-full flex-col"
      >
        <PageTitleBar title={data?.chapterTitle ?? ''} backTo={{ to: '/learning' }} />
        {/* 하단 탭 영역은 앱 셸이 확보한다. */}
        <main className="flex-1 px-4 pt-5 pb-4">
          <ChapterHeading chapterId={chapterId} headingLevel={2} />
          <UnitList chapterId={chapterId} className="mt-6" />
        </main>
      </div>
    </SpaceBackground>
  );
}
