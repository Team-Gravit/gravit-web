import { createFileRoute } from '@tanstack/react-router';

import { ConceptNotePage } from '@/pages/concept-note';

export const Route = createFileRoute(
  '/_authenticated/_app-shell/learning/units/$unitId/concept-note',
)({
  // 모바일에서는 하단 탭 없이 개념노트에 집중하도록 전체 화면으로 표시한다.
  staticData: { hideBottomTabBar: true },
  component: ConceptNoteRoute,
});

function ConceptNoteRoute() {
  const { unitId } = Route.useParams();

  return <ConceptNotePage unitId={unitId} />;
}
