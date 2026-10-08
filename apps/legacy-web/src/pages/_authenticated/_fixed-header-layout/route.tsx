import { createFileRoute, Outlet } from '@tanstack/react-router';

import Header from '@/widgets/header/ui/header';

export const Route = createFileRoute('/_authenticated/_fixed-header-layout')({
  component: FixedHeaderLayoutComponent,
});

function FixedHeaderLayoutComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <Header variant="solid" />
      </div>
      <Outlet />
    </div>
  );
}
