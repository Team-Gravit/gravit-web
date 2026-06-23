import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

import UserTabs from './user-tabs';

const withUserTabRouter = (initialPath = '/my/summary') => {
  function UserTabRouterDecorator(Story: React.ComponentType) {
    const rootRoute = createRootRoute({
      component: () => <Outlet />,
    });

    const routes = ['/my/summary', '/my/learning', '/my/league', '/my/social'].map((path) =>
      createRoute({
        getParentRoute: () => rootRoute,
        path,
        component: () => <Story />,
      }),
    );

    const router = createRouter({
      history: createMemoryHistory(),
      routeTree: rootRoute.addChildren(routes),
    });

    router.navigate({ to: initialPath });

    return (
      <div className="bg-text-2-w p-4">
        <RouterProvider router={router} />
      </div>
    );
  }

  return UserTabRouterDecorator;
};

const meta: Meta<typeof UserTabs> = {
  title: 'Widgets/User/UI/UserTabs',
  component: UserTabs,
  decorators: [withUserTabRouter()],
};

export default meta;

type Story = StoryObj<typeof UserTabs>;

export const Default: Story = {
  name: '데스크탑',
};

export const Mobile: Story = {
  name: '모바일',
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
};
