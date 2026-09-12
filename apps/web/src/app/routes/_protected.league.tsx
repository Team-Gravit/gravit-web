import { createFileRoute } from '@tanstack/react-router';

import { LeaguePage } from '@/pages/league';

export const Route = createFileRoute('/_protected/league')({
  component: LeaguePage,
});
