import { createFileRoute, Outlet } from '@tanstack/react-router';

import Tabs from '@/shared/ui/tab/tab';

export const Route = createFileRoute('/_authenticated/settings/inquiry')({
  component: RouteComponent,
});

const INQUIRY_TABS = [
  { to: '/settings/inquiry/new', label: '문의하기' },
  { to: '/settings/inquiry', label: '문의내역확인' },
] as const;

function RouteComponent() {
  return (
    <section className="px-4 pt-5 max-w-300 mx-auto w-full flex-1 pb-20 flex flex-col gap-3 md:gap-8">
      <Tabs>
        {INQUIRY_TABS.map((tab) => (
          <Tabs.Tab
            key={`${tab.label}-${tab.to}`}
            activeOptions={{ exact: true }}
            replace={true}
            to={tab.to}
            as="link"
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <Outlet />
    </section>
  );
}
