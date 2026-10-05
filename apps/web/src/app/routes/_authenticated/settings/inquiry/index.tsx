import { createFileRoute } from '@tanstack/react-router';

import { InquiryHistoryPage } from '@/pages/inquiry';

export const Route = createFileRoute('/_authenticated/settings/inquiry/')({
  validateSearch: (search: Record<string, unknown>): { page: number } => {
    const page = Number(search.page);
    return { page: Number.isFinite(page) && page > 0 ? page : 1 };
  },
  component: InquiryHistoryRoute,
});

function InquiryHistoryRoute() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <InquiryHistoryPage page={page} onPageChange={(next) => navigate({ search: { page: next } })} />
  );
}
