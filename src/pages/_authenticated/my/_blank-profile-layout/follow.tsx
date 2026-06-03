import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import z from 'zod';

import { useGetFollowAndFollowingCount } from '@/shared/api/@generated/friend-api/friend-api';
import LeftArrow from '@/shared/assets/icons/buttons/left-arrow.svg?react';
import FollowListContainer from '@/widgets/user/follow/follow-list-container';
import FollowListTab from '@/widgets/user/follow/follow-list-tab';

const searchSchema = z.object({
  tab: z.enum(['followers', 'following']).catch('followers'),
});

export const Route = createFileRoute('/_authenticated/my/_blank-profile-layout/follow')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { tab: activeTab } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isPending: isGetFollowCountPending } = useGetFollowAndFollowingCount();

  if (isGetFollowCountPending || !data) return null;

  return (
    <div className="pt-[49px]">
      <header className="fixed top-0 left-0 w-full bg-white border-b border-divider-1">
        <div className="flex justify-center w-full relative py-4">
          <Link to="/my/social" className="p-3 absolute top-0 left-0">
            <LeftArrow className="size-6" />
          </Link>
          <h3 className="text-label1">친구</h3>
        </div>
      </header>

      <section className="min-h-svh bg-bg-1">
        <header className="px-4 py-5">
          <FollowListTab
            activeTab={activeTab}
            followerCount={data.followerCount ?? 0}
            followingCount={data.followingCount ?? 0}
            setActiveTab={(nextTab) => {
              navigate({ search: { tab: nextTab }, replace: true });
            }}
          />
        </header>

        <FollowListContainer type={activeTab} />
      </section>
    </div>
  );
}
