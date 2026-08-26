import { createFileRoute, Outlet } from '@tanstack/react-router';

import EntryLayout from '@/shared/ui/layout/entry-layout';

export const Route = createFileRoute('/_authenticated/_onboarding')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className=" mx-auto w-full h-svh">
      <EntryLayout className="justify-between pb-5">
        <Outlet />
      </EntryLayout>
    </div>
  );
}
