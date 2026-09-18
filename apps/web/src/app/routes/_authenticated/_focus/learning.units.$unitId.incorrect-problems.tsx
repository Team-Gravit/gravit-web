import { createFileRoute } from '@tanstack/react-router';

// 오답 문제 풀이 화면을 이전할 때까지 유닛 상세에서 사용할 경로 계약만 유지한다.
export const Route = createFileRoute(
  '/_authenticated/_focus/learning/units/$unitId/incorrect-problems',
)({
  component: () => null,
});
