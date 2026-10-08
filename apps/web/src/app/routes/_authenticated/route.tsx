import { createFileRoute, redirect } from '@tanstack/react-router';

import { SessionGuard } from '@/app/auth/session-guard';
import { getSessionToken } from '@/entities/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!getSessionToken()) {
      throw redirect({ to: '/' });
    }
  },
  component: SessionGuard,
});
