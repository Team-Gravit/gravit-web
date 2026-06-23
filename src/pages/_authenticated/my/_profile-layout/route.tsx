import { createFileRoute, Outlet } from '@tanstack/react-router';

import { useGetMyPageBanner } from '@/shared/api/@generated/mypage-api/mypage-api';
import { HEADER_HEIGHT } from '@/shared/config/constants';
import useResponsive from '@/shared/model/use-responsive';
import PageLayout from '@/shared/ui/layout/page-layout';
import Header from '@/widgets/header/ui/_header';
import UserProfileCard from '@/widgets/user/ui/user-profile-card';
import UserTabs from '@/widgets/user/ui/user-tabs';

export const Route = createFileRoute('/_authenticated/my/_profile-layout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useResponsive();
  const { data } = useGetMyPageBanner();
  return (
    <PageLayout bottomTabBar={isMobile}>
      {isMobile ? null : <Header />}
      <div
        className="w-full h-full flex flex-col  "
        style={{ paddingTop: isMobile ? 0 : HEADER_HEIGHT + 20 * 2 }}
      >
        {data && <UserProfileCard {...data} />}
        <div className="w-full flex-1 flex flex-col gap-5 md:gap-10 p-5 md:p-0 md:pt-10">
          <UserTabs />
          <Outlet />
        </div>
      </div>
    </PageLayout>
  );
}
