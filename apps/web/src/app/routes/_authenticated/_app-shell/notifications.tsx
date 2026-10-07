import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { NotificationsPage } from '@/pages/notifications';

export const Route = createFileRoute('/_authenticated/_app-shell/notifications')({
  component: NotificationsRoute,
});

function NotificationsRoute() {
  const navigate = useNavigate();
  const isWide = useIsWideViewport();

  // 데스크톱은 알림이 헤더 팝오버로 뜨므로, 전체 화면 /notifications 로 오면 마이그래빗으로 되돌린다.
  useEffect(() => {
    if (isWide) {
      navigate({ to: '/my', replace: true });
    }
  }, [isWide, navigate]);

  if (isWide) {
    return null;
  }

  return <NotificationsPage />;
}
