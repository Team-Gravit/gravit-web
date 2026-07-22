import { createFileRoute, Outlet } from '@tanstack/react-router';

import Header from '@/widgets/header/ui/header';

export const Route = createFileRoute('/_authenticated/_overlay-header-layout')({
  component: OverlayHeaderLayout,
});

function OverlayHeaderLayout() {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <Header variant="overlay" />
      </div>
      <Outlet />
    </div>
  );
}
