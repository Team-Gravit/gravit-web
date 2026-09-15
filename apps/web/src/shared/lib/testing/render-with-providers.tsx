import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type AnyRouter,
  type RouteComponent,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, type RenderResult } from '@testing-library/react';

export interface RenderWithProvidersOptions {
  /** 대상이 마운트될 경로. 기본 `/`. */
  path?: string;
  /** `<Link>` 목적지로 필요한 경로들. 빈 컴포넌트로 등록한다. */
  extraPaths?: string[];
  queryClient?: QueryClient;
}

/**
 * `Link`와 Query 훅을 사용하는 컴포넌트를 최소 라우터와 QueryClient 안에서 렌더링한다.
 *
 * 앱 전체 routeTree 대신 필요한 경로만 만들고, 첫 렌더가 비지 않도록 `router.load()`를 기다린다.
 */
export async function renderWithProviders(
  Component: RouteComponent,
  { path = '/', extraPaths = [], queryClient }: RenderWithProvidersOptions = {},
): Promise<RenderResult & { router: AnyRouter; queryClient: QueryClient }> {
  const rootRoute = createRootRoute();
  const routes = [
    createRoute({ getParentRoute: () => rootRoute, path, component: Component }),
    ...extraPaths.map((extraPath) =>
      createRoute({ getParentRoute: () => rootRoute, path: extraPath, component: () => null }),
    ),
  ];
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  // 실패 케이스가 재시도 대기로 늘어지지 않게 한다.
  const client = queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } });

  await router.load();

  const view = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return { ...view, router: router as AnyRouter, queryClient: client };
}
