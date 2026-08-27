import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import NotFoundPage from '@/widgets/status-widget/not-found-page';

export interface RouteContext {
  auth: AuthState;
}

export interface AuthState {
  isAuthenticated: boolean;
}

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};
export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFoundPage />,
});
