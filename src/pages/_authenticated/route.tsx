import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { tokenManager } from '@/shared/api/config';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!tokenManager.getAccessToken()) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});
