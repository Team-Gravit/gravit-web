import { createFileRoute } from '@tanstack/react-router';

// 오답 문제 풀이 화면을 이전할 때까지 유닛 상세의 목적지만 제공한다.
export const Route = createFileRoute(
  '/_authenticated/_focus/learning/units/$unitId/incorrect-problems',
)({
  component: () => null,
});
