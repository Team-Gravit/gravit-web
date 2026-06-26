import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';

import useResponsive from '@/shared/model/use-responsive';
import BackButtonMobileHeader from '@/shared/ui/layout/header/back-button-mobile-header';
import Header from '@/widgets/header/ui/_header';

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useResponsive();
  const matches = useMatches();
  const lastMatches = matches[matches.length - 1];
  const pageTitle = lastMatches?.staticData?.pageTitle ?? '';

  return (
    <div className="flex flex-col min-h-svh bg-bg-2">
      {isMobile ? <BackButtonMobileHeader pageTitle={pageTitle} /> : <Header />}
      <main className="md:pt-[110px] flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
