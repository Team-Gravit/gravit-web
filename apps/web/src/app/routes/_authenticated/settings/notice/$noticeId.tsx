import { createFileRoute } from '@tanstack/react-router';

import { preloadMarkdown } from '@/shared/ui/markdown';
import { NoticeDetailPage } from '@/pages/notice-detail';

export const Route = createFileRoute('/_authenticated/settings/notice/$noticeId')({
  // 본문 Markdown 청크를 진입 즉시 받기 시작해, 데이터 조회와 병렬로 준비되게 한다.
  loader: preloadMarkdown,
  component: NoticeDetailRoute,
});

function NoticeDetailRoute() {
  const { noticeId } = Route.useParams();

  return <NoticeDetailPage noticeId={Number(noticeId)} />;
}
