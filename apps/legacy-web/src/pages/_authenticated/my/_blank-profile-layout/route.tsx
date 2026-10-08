import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';

import useResponsive from '@/shared/model/use-responsive';
import BackButtonMobileHeader from '@/shared/ui/layout/header/back-button-mobile-header';
import Header from '@/widgets/header/ui/header';

export const Route = createFileRoute('/_authenticated/my/_blank-profile-layout')({
  component: MyLayout,
});

function MyLayout() {
  const { isMobile } = useResponsive();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const pageTitle = lastMatch?.staticData?.pageTitle ?? '';

  return (
    <div className="flex flex-col min-h-svh">
      {isMobile ? <BackButtonMobileHeader pageTitle={pageTitle} /> : <Header variant="solid" />}
      <main className="pt-[var(--mobile-header-height)] md:pt-[110px] flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
