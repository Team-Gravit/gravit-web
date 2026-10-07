import { createFileRoute } from '@tanstack/react-router';

import { ReviewQuizPage } from '@/pages/review-quiz';

import { createReviewQuizLeaveHandler, parseReviewQuizUnitId } from './-review-quiz-route';

export const Route = createFileRoute(
  '/_authenticated/_focus/learning/units/$unitId/bookmarked-problems',
)({
  beforeLoad: parseReviewQuizUnitId,
  component: BookmarkQuizRoute,
  onLeave: createReviewQuizLeaveHandler('bookmark'),
});

function BookmarkQuizRoute() {
  const { unitId } = Route.useRouteContext();

  return <ReviewQuizPage kind="bookmark" unitId={unitId} />;
}
