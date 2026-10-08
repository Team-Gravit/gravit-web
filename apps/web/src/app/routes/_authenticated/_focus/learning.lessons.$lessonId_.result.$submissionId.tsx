import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { LessonResultPage } from '@/pages/lesson-result';

export const Route = createFileRoute(
  '/_authenticated/_focus/learning/lessons/$lessonId_/result/$submissionId',
)({
  // `$lessonId_`로 풀이 라우트와의 중첩만 끊고 URL은 그대로 유지한다.
  beforeLoad: ({ params, location }) => {
    // 제출 직후와 새로고침만 허용하고 주소 공유나 직접 접근은 학습 홈으로 보낸다.
    if (!location.state.fromLessonSubmission) {
      throw redirect({ to: '/learning' });
    }

    const lessonSubmissionId = Number(params.submissionId);

    if (!Number.isInteger(lessonSubmissionId) || lessonSubmissionId <= 0) {
      throw notFound();
    }

    return { lessonSubmissionId };
  },
  component: LessonResultRoute,
});

function LessonResultRoute() {
  const { lessonSubmissionId } = Route.useRouteContext();

  return <LessonResultPage lessonSubmissionId={lessonSubmissionId} />;
}
