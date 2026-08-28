import { createRootRoute, Outlet } from '@tanstack/react-router';

import { NotFoundPage } from '@/pages/not-found';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
});
