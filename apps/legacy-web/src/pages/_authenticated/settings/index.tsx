import { createFileRoute } from '@tanstack/react-router';

import SettingBox from '@/widgets/setting-box/setting-box';
export const Route = createFileRoute('/_authenticated/settings/')({
  component: RouteComponent,
  staticData: { pageTitle: '환경설정' },
});

function RouteComponent() {
  return (
    <section className="py-5 px-4">
      <SettingBox />
    </section>
  );
}
