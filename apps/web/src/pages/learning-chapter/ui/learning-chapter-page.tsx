import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { LearningChapterPageNarrow } from './learning-chapter-page-narrow';
import { LearningChapterPageWide } from './learning-chapter-page-wide';

export interface LearningChapterPageProps {
  chapterId: number;
}

export function LearningChapterPage({ chapterId }: LearningChapterPageProps) {
  // 모바일과 데스크톱의 DOM 구조가 달라 컴포넌트 단위로 분기한다.
  const isWide = useIsWideViewport();

  return isWide ? (
    <LearningChapterPageWide chapterId={chapterId} />
  ) : (
    <LearningChapterPageNarrow chapterId={chapterId} />
  );
}
