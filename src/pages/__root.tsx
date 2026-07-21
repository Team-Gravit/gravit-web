import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Page404Component from '@/widgets/error-widget/Page404Component';

export interface RouteContext {
  auth: AuthState;
}

export interface AuthState {
  isAuthenticated: boolean;
}

const RootLayout = () => {
  // PC면 정상적으로 라우터 사용
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};
export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => <RootLayout />,
  notFoundComponent: () => <Page404Component />,
});
