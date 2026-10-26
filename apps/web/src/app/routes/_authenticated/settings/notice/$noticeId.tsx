import { createFileRoute } from '@tanstack/react-router';

import { NoticeDetailPage } from '@/pages/notice-detail';

export const Route = createFileRoute('/_authenticated/settings/notice/$noticeId')({
  component: NoticeDetailRoute,
});

function NoticeDetailRoute() {
  const { noticeId } = Route.useParams();

  return <NoticeDetailPage noticeId={Number(noticeId)} />;
}
