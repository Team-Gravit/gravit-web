import { createFileRoute } from '@tanstack/react-router';

import type { InterviewHistorySort } from '@/entities/interview';
import { InterviewHistoryPage } from '@/pages/interview-history';

interface InterviewHistorySearch {
  page: number;
  sort: InterviewHistorySort;
}

export const Route = createFileRoute('/_authenticated/_app-shell/interview/history/')({
  validateSearch: (search: Record<string, unknown>): InterviewHistorySearch => {
    const page = Number(search.page);
    return {
      page: Number.isInteger(page) && page > 0 ? page : 1,
      sort: search.sort === 'OLDEST' ? 'OLDEST' : 'LATEST',
    };
  },
  component: InterviewHistoryRoute,
});

function InterviewHistoryRoute() {
  const { page, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <InterviewHistoryPage
      page={page}
      sort={sort}
      onPageChange={(nextPage) => navigate({ search: { page: nextPage, sort } })}
      // 정렬이 바뀌면 목록 순서가 달라지므로 첫 페이지부터 보여준다.
      onSortChange={(nextSort) => navigate({ search: { page: 1, sort: nextSort } })}
    />
  );
}
