import { createFileRoute } from '@tanstack/react-router';

import { MyTabPlaceholder } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/league')({
  component: LeagueTab,
});

function LeagueTab() {
  return <MyTabPlaceholder label="리그" />;
}
