import { createFileRoute } from '@tanstack/react-router';

import { ReviewQuizPage } from '@/pages/review-quiz';

import { createReviewQuizLeaveHandler, validateReviewQuizUnitId } from './-review-quiz-route';

export const Route = createFileRoute(
  '/_authenticated/_focus/learning/units/$unitId/incorrect-problems',
)({
  beforeLoad: validateReviewQuizUnitId,
  component: WrongAnswerQuizRoute,
  onLeave: createReviewQuizLeaveHandler('wrongAnswer'),
});

function WrongAnswerQuizRoute() {
  const { unitId } = Route.useRouteContext();

  return <ReviewQuizPage kind="wrongAnswer" unitId={unitId} />;
}
