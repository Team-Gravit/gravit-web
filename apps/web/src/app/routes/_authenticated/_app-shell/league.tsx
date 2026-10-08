import { createFileRoute } from '@tanstack/react-router';

import { LeaguePage } from '@/pages/league';

export const Route = createFileRoute('/_authenticated/_app-shell/league')({
  staticData: { headerVariant: 'overlay' },
  component: LeaguePage,
});
