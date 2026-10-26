import { createFileRoute, notFound } from '@tanstack/react-router';

import type { ReportTab } from '@/entities/interview';
import { InterviewReportPage } from '@/pages/interview-report';

interface InterviewReportSearch {
  tab: ReportTab;
  /** 문항별 상세에서 펼칠 문항 순서. 없으면 첫 문항이다. */
  question?: number;
}

export const Route = createFileRoute('/_authenticated/_app-shell/interview/history/$sessionId')({
  beforeLoad: ({ params }) => {
    const sessionId = Number(params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw notFound();
    }

    return { sessionId };
  },
  validateSearch: (search: Record<string, unknown>): InterviewReportSearch => {
    const question = Number(search.question);
    return {
      tab: search.tab === 'answers' ? 'answers' : 'summary',
      question: Number.isInteger(question) && question > 0 ? question : undefined,
    };
  },
  component: InterviewReportRoute,
});

function InterviewReportRoute() {
  const { sessionId } = Route.useRouteContext();
  const { tab, question } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <InterviewReportPage
      sessionId={sessionId}
      tab={tab}
      question={question}
      // 탭과 문항 이동은 기록에 쌓지 않는다. 뒤로 가기는 응시 이력으로 돌아간다.
      onQuestionSelect={(nextQuestion) =>
        navigate({ search: { tab: 'answers', question: nextQuestion }, replace: true })
      }
    />
  );
}
