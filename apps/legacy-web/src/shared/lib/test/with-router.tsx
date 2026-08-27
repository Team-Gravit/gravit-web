import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type NavigateOptions,
  Outlet,
  type RouteById,
  type RouteIds,
  RouterProvider,
} from '@tanstack/react-router';
import type { JSX } from 'react';
import { fn } from 'storybook/test';

import type { router } from '@/app/router';

export type ExtractRouteOptions<TId extends RouteIds<(typeof router)['routeTree']>> = Omit<
  NavigateOptions<typeof router, string, TId>,
  'to' | 'search' | 'params'
> & {
  search?: Partial<RouteById<(typeof router)['routeTree'], TId>['types']['fullSearchSchema']>;
} & (RouteById<(typeof router)['routeTree'], TId>['types']['allParams'] extends Record<
    string,
    never
  >
    ? { params?: undefined }
    : {
        params: RouteById<(typeof router)['routeTree'], TId>['types']['allParams'];
      });

/**
 * A utility component to wrap children with a mocked router for testing purposes.
 * It allows you to specify the initial route, search parameters, and route parameters.
 *
 * @param children - The child components to be rendered within the router context.
 * @param routeId - The ID of the route to navigate to initially.
 * @param search - Optional search parameters for the route.
 * @param params - Optional route parameters.
 *
 * @returns A RouterProvider component that provides the mocked router context.
 */
export const WithRouter = <
  TRouter extends typeof router,
  const TId extends RouteIds<TRouter['routeTree']>,
>({
  children,
  routeId,
  path,
  search,
  params,
}: React.PropsWithChildren<
  {
    routeId: TId;
    path?: string;
  } & ExtractRouteOptions<TId>
>) => {
  const history = createMemoryHistory();
  const initialPath = String(path ?? routeId);

  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </>
    ),
  });
  const mockedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: initialPath,
    component: () => children,
  });

  const mockedRouter = createRouter({
    history,
    routeTree: rootRoute.addChildren([mockedRoute]),
  });

  const navigateOptions = {
    to: initialPath === '/' ? '/' : initialPath.replace(/\/$/, ''),
    search,
    params,
  } as Parameters<typeof mockedRouter.navigate>[0];

  mockedRouter.navigate(navigateOptions);

  mockedRouter.navigate = fn();

  return <RouterProvider router={mockedRouter} />;
};

// 테스트 유틸리티 파일 — react-refresh 규칙 비적용
// eslint-disable-next-line react-refresh/only-export-components
export const withTanstackRouter = <
  TRouter extends typeof router,
  const TId extends RouteIds<TRouter['routeTree']>,
>(
  options: {
    routeId: TId;
    path?: string;
  } & ExtractRouteOptions<TId>,
) => {
  const Wrapper = (Story: React.ComponentType): JSX.Element => {
    return (
      // @ts-expect-error Couldn't get this to internally type nicely, but it works and the external facing types are accurate.
      <WithRouter<TRouter, TId> {...options}>
        <Story />
      </WithRouter>
    );
  };
  Wrapper.displayName = 'WithTanstackRouter';
  return Wrapper;
};
