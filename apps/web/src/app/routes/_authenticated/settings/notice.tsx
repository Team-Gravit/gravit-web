import { createFileRoute } from '@tanstack/react-router';

import { NoticePage } from '@/pages/notice';

export const Route = createFileRoute('/_authenticated/settings/notice')({
  validateSearch: (search: Record<string, unknown>): { page: number } => {
    const page = Number(search.page);
    return { page: Number.isFinite(page) && page > 0 ? page : 1 };
  },
  component: NoticeRoute,
});

function NoticeRoute() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();

  return <NoticePage page={page} onPageChange={(next) => navigate({ search: { page: next } })} />;
}
