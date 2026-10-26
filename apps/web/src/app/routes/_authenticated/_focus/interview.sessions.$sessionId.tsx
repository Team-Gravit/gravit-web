import { InterviewSessionPage } from '@/pages/interview';
import { createFileRoute, notFound } from '@tanstack/react-router';

// 생성된 세션의 이동 경로만 먼저 연결한다. 문항 응답 페이지 구현 시 loader와 component를 교체한다.
// 현재는 유효한 sessionId인지 검사하며, 본문은 표시하지 않는다.
export const Route = createFileRoute('/_authenticated/_focus/interview/sessions/$sessionId')({
  beforeLoad: ({ params }) => {
    const sessionId = Number(params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw notFound();
    }

    return { sessionId };
  },
  component: () => <InterviewSessionPage />,
});
