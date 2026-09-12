import { Tabs } from '@/shared/ui/tab';

const MY_PAGE_TABS = [
  { to: '/my/summary', label: '요약' },
  { to: '/my/learning', label: '학습' },
  { to: '/my/league', label: '리그' },
  { to: '/my/social', label: '소셜' },
] as const;

/** 마이페이지 4개 섹션(요약·학습·리그·소셜) 링크 탭. 현재 경로에 해당하는 탭이 활성 표시된다. */
export function MyPageTabs() {
  return (
    <Tabs>
      {MY_PAGE_TABS.map((tab) => (
        <Tabs.Tab key={tab.to} to={tab.to} activeOptions={{ exact: true }}>
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}
