import { SpaceBackground } from '@/shared/ui/layout';
import { ChapterHeading } from '@/widgets/chapter-heading';
import { UnitList } from '@/widgets/unit-list';

export interface LearningChapterPageWideProps {
  chapterId: number;
}

/**
 * 앱 셸의 고정 헤더 여백을 배경에서만 되돌려 별 레이어가 헤더 뒤까지 이어지게 한다.
 * `min-h-full`은 스크롤 영역 기준이라 하단이 비므로 `SpaceBackground`의 `min-h-svh`를 유지한다.
 */
const SURFACE_CLASS = 'bg-bg-2 -mt-(--desktop-header-height) pt-(--desktop-header-height)';

/**
 * 1200px 본문과 최소 32px 여백을 함께 보장한다. 제목도 같은 컬럼에 두어 좁아질 때 고정 제목선이
 * 목록보다 오른쪽으로 들어가는 역전을 막는다 (FIX-034).
 */
const MAIN_CLASS = 'mx-auto w-full max-w-316 px-8 pt-5 pb-20';

export function LearningChapterPageWide({ chapterId }: LearningChapterPageWideProps) {
  return (
    <SpaceBackground variant="starfield" className={SURFACE_CLASS}>
      <main data-slot="learning-chapter-page" data-layout="wide" className={MAIN_CLASS}>
        <ChapterHeading chapterId={chapterId} withBreadcrumb className="mb-10" />
        <UnitList chapterId={chapterId} />
      </main>
    </SpaceBackground>
  );
}
