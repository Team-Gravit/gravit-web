import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { Tabs } from './tab';

const DEMO_TABS = [
  { to: '/my/summary', label: '요약' },
  { to: '/my/learning', label: '학습' },
  { to: '/my/league', label: '리그' },
  { to: '/my/social', label: '소셜' },
] as const;

function TabsPreview() {
  return (
    <div className="w-90 md:w-180">
      <Tabs>
        {DEMO_TABS.map((tab) => (
          <Tabs.Tab key={tab.to} to={tab.to} activeOptions={{ exact: true }}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <Outlet />
    </div>
  );
}

/**
 * Tabs 는 TanStack Router `Link` 로 활성 상태를 표시하므로 스토리에도 라우터가 필요하다.
 * 초기 경로만 다른 메모리 라우터를 만들어 어떤 탭이 활성인지 보여준다.
 */
function createStoryRouter(initialPath: string) {
  const rootRoute = createRootRoute({ component: TabsPreview });
  const childRoutes = DEMO_TABS.map((tab) =>
    createRoute({ getParentRoute: () => rootRoute, path: tab.to.slice(1), component: () => null }),
  );

  return createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

const summaryRouter = createStoryRouter('/my/summary');
const leagueRouter = createStoryRouter('/my/league');

// Tabs 는 compound(`Tabs.Tab`) + Link 조합이라 args 가 아니라 render 로 문서화한다.
// 따라서 meta 에 component 를 두지 않는다(필수 children 이 args 를 강제하기 때문).
const meta = {
  title: 'Primitives/Tabs',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: '기본 (요약 활성)',
  render: () => <RouterProvider router={summaryRouter} />,
};

export const LeagueActive: Story = {
  name: '리그 활성',
  render: () => <RouterProvider router={leagueRouter} />,
};
