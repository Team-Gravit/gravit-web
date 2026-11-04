import { createFileRoute, notFound } from '@tanstack/react-router';

import { InterviewGradingPage } from '@/pages/interview';

export const Route = createFileRoute(
  '/_authenticated/_focus/interview/sessions/grading/$sessionId',
)({
  beforeLoad: ({ params }) => {
    const sessionId = Number(params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw notFound();
    }

    return { sessionId };
  },
  component: GradingRoute,
});

function GradingRoute() {
  const { sessionId } = Route.useParams();

  return <InterviewGradingPage sessionId={Number(sessionId)} />;
}
