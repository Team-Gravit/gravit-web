import { createFileRoute, Outlet } from '@tanstack/react-router';

import useResponsive from '@/shared/model/use-responsive';
import Header from '@/widgets/header/ui/header';

export const Route = createFileRoute('/_authenticated/_fixed-header-layout')({
  component: FixedHeaderLayoutComponent,
});

function FixedHeaderLayoutComponent() {
  const { isDesktop } = useResponsive();

  return (
    <div className="flex flex-col min-h-screen">
      {isDesktop && <Header />}
      <Outlet />
    </div>
  );
}
