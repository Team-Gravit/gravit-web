import { createFileRoute } from '@tanstack/react-router';

import { LearningChapterPage } from '@/pages/learning-chapter';

// 챕터 상세는 콘텐츠가 헤더 아래에서 시작하므로 불투명 헤더를 사용한다.
export const Route = createFileRoute('/_authenticated/_app-shell/learning/chapters/$chapterId/')({
  component: RouteComponent,
  staticData: { headerVariant: 'solid' },
});

function RouteComponent() {
  const { chapterId } = Route.useParams();

  return <LearningChapterPage chapterId={Number(chapterId)} />;
}
