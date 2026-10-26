import { createFileRoute, notFound } from '@tanstack/react-router';

import { InterviewConfirmPage } from '@/pages/interview';

export const Route = createFileRoute(
  '/_authenticated/_focus/interview/sessions/confirm/$sessionId',
)({
  beforeLoad: ({ params }) => {
    const sessionId = Number(params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw notFound();
    }

    return { sessionId };
  },
  component: ConfirmRoute,
});

function ConfirmRoute() {
  const { sessionId } = Route.useParams();

  return <InterviewConfirmPage sessionId={Number(sessionId)} />;
}
