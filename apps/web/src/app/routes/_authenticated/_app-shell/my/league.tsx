import { createFileRoute } from '@tanstack/react-router';

import { LeagueTab } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/league')({
  component: LeagueTab,
});
