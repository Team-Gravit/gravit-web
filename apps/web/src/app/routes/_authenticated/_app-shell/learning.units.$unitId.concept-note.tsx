import { createFileRoute } from '@tanstack/react-router';

// 개념노트 화면을 이전할 때까지 유닛 상세의 목적지만 제공한다.
export const Route = createFileRoute(
  '/_authenticated/_app-shell/learning/units/$unitId/concept-note',
)({
  component: () => null,
});
