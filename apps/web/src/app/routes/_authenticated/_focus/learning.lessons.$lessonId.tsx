import { createFileRoute, notFound } from '@tanstack/react-router';

import { clearStoredQuizSession } from '@/features/lesson-quiz';
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
  // 새로고침에는 저장본을 유지하고 실제 라우트 이탈에서만 삭제한다.
  // 컴포넌트 정리 함수는 StrictMode에서도 실행돼 두 경우를 구분할 수 없다.
  onLeave: ({ params }) => clearStoredQuizSession(Number(params.lessonId)),
});

function LessonQuizRoute() {
  const { lessonId } = Route.useRouteContext();

  return <LessonQuizPage lessonId={lessonId} />;
}
