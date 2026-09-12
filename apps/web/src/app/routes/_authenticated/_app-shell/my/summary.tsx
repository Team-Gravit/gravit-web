import { createFileRoute } from '@tanstack/react-router';

import { MyTabPlaceholder } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/summary')({
  component: SummaryTab,
});

function SummaryTab() {
  return <MyTabPlaceholder label="요약" />;
}
