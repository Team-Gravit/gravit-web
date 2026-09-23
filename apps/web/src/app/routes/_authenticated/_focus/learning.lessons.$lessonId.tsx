import { createFileRoute, notFound } from '@tanstack/react-router';

import { LessonQuizPage } from '@/pages/lesson-quiz';

export const Route = createFileRoute('/_authenticated/_focus/learning/lessons/$lessonId')({
  // 유효하지 않은 ID는 조회를 시작하지 못하고 로딩 화면에 머무르므로 진입 전에 차단한다.
  beforeLoad: ({ params }) => {
    const lessonId = Number(params.lessonId);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      throw notFound();
    }

    return { lessonId };
  },
  component: LessonQuizRoute,
});

function LessonQuizRoute() {
  const { lessonId } = Route.useRouteContext();

  return <LessonQuizPage lessonId={lessonId} />;
}
