import { createFileRoute, Outlet } from '@tanstack/react-router';

import { useGetAllUnitInChapter } from '@/shared/api/@generated/unit-api/unit-api';
import DesktopBackground from '@/shared/assets/_images/background/desktop-transparent-background.png';
import MobileBackground from '@/shared/assets/_images/background/mobile-transparent-background.png';
import useResponsive from '@/shared/model/use-responsive';
import BackButtonMobileHeader from '@/shared/ui/layout/header/back-button-mobile-header';
import BottomTabBar from '@/widgets/bottom-tab-bar/bottom-tab-bar';

export const Route = createFileRoute('/_authenticated/_overlay-header-layout/learning/$chapterId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapterId } = Route.useParams();
  const { isMobile } = useResponsive();

  const { data, isPending } = useGetAllUnitInChapter(Number(chapterId));

  if (!data || isPending) return null;

  return (
    <div className="pt-[var(--mobile-header-height)] pb-[var(--bottom-tab-height)] md:p-0 h-svh overflow-hidden">
      {isMobile && <BackButtonMobileHeader pageTitle={data.chapterSummaryResponse.title} />}
      <main
        style={{
          backgroundImage: isMobile ? `url(${MobileBackground})` : `url(${DesktopBackground})`,
        }}
        className="bg-bg-2 bg-cover bg-no-repeat h-full md:pt-[var(--desktop-header-height)]"
      >
        <Outlet />
      </main>
      {isMobile && <BottomTabBar />}
    </div>
  );
}
