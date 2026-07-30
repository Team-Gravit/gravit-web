import { createFileRoute, useNavigate } from '@tanstack/react-router';
import z from 'zod';

import { useGetFollowAndFollowingCount } from '@/shared/api/@generated/friend-api/friend-api';
import useResponsive from '@/shared/model/use-responsive';
import PageLayout from '@/shared/ui/layout/page-layout';
import FollowListContainer from '@/widgets/user/follow/follow-list-container';
import FollowListTab from '@/widgets/user/follow/follow-list-tab';

const searchSchema = z.object({
  tab: z.enum(['followers', 'following']).catch('followers'),
});

export const Route = createFileRoute('/_authenticated/my/_blank-profile-layout/follow')({
  validateSearch: searchSchema,
  component: RouteComponent,
  staticData: { pageTitle: '친구' },
});

function RouteComponent() {
  const { tab: activeTab } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { isMobile } = useResponsive();

  const { data, isPending: isGetFollowCountPending } = useGetFollowAndFollowingCount();

  if (isGetFollowCountPending || !data) return null;

  return (
    <PageLayout bottomTabBar={isMobile}>
      <section className="min-h-svh bg-bg-1">
        <header className="px-4 py-5">
          <FollowListTab
            activeTab={activeTab}
            followerCount={data.followerCount}
            followingCount={data.followingCount}
            setActiveTab={(nextTab) => {
              navigate({ search: { tab: nextTab }, replace: true });
            }}
          />
        </header>

        <FollowListContainer type={activeTab} />
      </section>
    </PageLayout>
  );
}
