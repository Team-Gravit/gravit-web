import { createFileRoute } from '@tanstack/react-router';

import { SummaryTab } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/summary')({
  component: SummaryTab,
});
