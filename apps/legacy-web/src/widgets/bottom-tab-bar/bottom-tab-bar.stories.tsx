import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

import BottomTabBar from './bottom-tab-bar';

const withBottomTabRouter = (initialPath = '/main') => {
  const Wrapper = (Story: React.ComponentType) => {
    const rootRoute = createRootRoute({
      component: () => <Outlet />,
    });

    const routes = ['/main', '/learning', '/league', '/user'].map((path) =>
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

    return <RouterProvider router={router} />;
  };
  Wrapper.displayName = 'WithBottomTabRouter';
  return Wrapper;
};

const meta: Meta<typeof BottomTabBar> = {
  title: 'Widgets/Tab/BottomTabBar',
  component: BottomTabBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 150,
      },
    },
  },
  tags: ['autodocs'],
  decorators: (Story) => (
    <div className="bg-gray-300 min-h-[150px] h-svh">
      <Story />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof BottomTabBar>;

export const Default: Story = {
  globals: {
    viewport: {
      viewports: {
        mobile375: {
          name: 'Mobile 375',
          styles: {
            width: '375px',
            height: '600px',
          },
        },
      },
      defaultViewport: 'mobile375',
    },
  },
  decorators: [withBottomTabRouter('/main')],
};
