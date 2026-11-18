import { createFileRoute } from '@tanstack/react-router';

import { preloadMarkdown } from '@/shared/ui/markdown';
import { ReviewQuizPage } from '@/pages/review-quiz';

import { createReviewQuizLeaveHandler, validateReviewQuizUnitId } from './-review-quiz-route';

export const Route = createFileRoute(
  '/_authenticated/_focus/learning/units/$unitId/incorrect-problems',
)({
  beforeLoad: validateReviewQuizUnitId,
  loader: preloadMarkdown,
  // 뒤로 스와이프는 풀이 상단의 닫기 처리를 거치지 않으므로 막는다.
  staticData: { swipeBack: false },
  component: WrongAnswerQuizRoute,
  onLeave: createReviewQuizLeaveHandler('wrongAnswer'),
});

function WrongAnswerQuizRoute() {
  const { unitId } = Route.useRouteContext();

  return <ReviewQuizPage kind="wrongAnswer" unitId={unitId} />;
}
