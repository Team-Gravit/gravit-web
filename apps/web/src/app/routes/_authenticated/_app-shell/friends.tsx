import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import type { FollowType } from '@/entities/follow';
import { FriendsPage } from '@/pages/friends';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

export const Route = createFileRoute('/_authenticated/_app-shell/friends')({
  validateSearch: (search: Record<string, unknown>): { tab: FollowType } => ({
    tab: search.tab === 'following' ? 'following' : 'followers',
  }),
  component: FriendsRoute,
});

function FriendsRoute() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const isWide = useIsWideViewport();

  // 데스크톱은 팔로우가 모달로 뜨므로, 전체 화면 /friends 로 오면 소셜 탭으로 되돌린다.
  useEffect(() => {
    if (isWide) {
      navigate({ to: '/my/social', replace: true });
    }
  }, [isWide, navigate]);

  if (isWide) {
    return null;
  }

  return (
    <FriendsPage
      activeTab={tab}
      onChangeTab={(next) => navigate({ to: '/friends', search: { tab: next }, replace: true })}
    />
  );
}
