import { Outlet, createFileRoute } from '@tanstack/react-router';

import { Tabs } from '@/shared/ui/tab';
import { PageTitleBar } from '@/widgets/page-title-bar';

export const Route = createFileRoute('/_authenticated/settings/inquiry')({
  component: InquiryLayout,
});

const INQUIRY_TABS = [
  { to: '/settings/inquiry/new', label: '문의하기' },
  { to: '/settings/inquiry', label: '문의내역확인' },
] as const;

/** 문의 화면 공통 레이아웃(legacy `settings/inquiry/route.tsx` 그대로). 좁은 화면 헤더만 web 셸에 맞춰 추가. */
function InquiryLayout() {
  return (
    <>
      {/* legacy는 설정 셸이 모바일 헤더를 제공했다. web 설정 셸은 데스크톱 헤더만 있어 여기서 보완한다. */}
      <PageTitleBar title="문의하기" backTo={{ to: '/settings' }} className="md:hidden" />

      <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-3 px-4 pt-5 pb-10 md:gap-8">
        {/* 목록 탭은 validateSearch(page)로 search가 붙는다. activeOptions에 includeSearch:false 를
            주지 않으면 search까지 비교해 활성 판정이 안 된다. */}
        <Tabs>
          {INQUIRY_TABS.map((tab) => (
            <Tabs.Tab
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: true, includeSearch: false }}
              replace
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs>
        <Outlet />
      </section>
    </>
  );
}
