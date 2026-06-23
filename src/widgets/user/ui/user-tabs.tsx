import Tabs from '@/shared/ui/tab/tab';

const USER_TABS = [
  { to: '/my/summary', label: '요약' },
  { to: '/my/learning', label: '학습' },
  { to: '/my/league', label: '리그' },
  { to: '/my/social', label: '소셜' },
] as const;

function UserTabs() {
  return (
    <Tabs>
      {USER_TABS.map((tab) => (
        <Tabs.Tab
          key={`${tab.label}-${tab.to}`}
          activeOptions={{ exact: true }}
          to={tab.to}
          as="link"
        >
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

export default UserTabs;
