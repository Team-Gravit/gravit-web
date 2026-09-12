import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_app-shell/my/')({
  beforeLoad: () => {
    throw redirect({ to: '/my/summary' });
  },
});
