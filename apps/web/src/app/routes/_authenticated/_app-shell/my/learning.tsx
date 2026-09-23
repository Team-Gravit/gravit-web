import { createFileRoute } from '@tanstack/react-router';

import { MyTabPlaceholder } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/learning')({
  component: LearningTab,
});

function LearningTab() {
  return <MyTabPlaceholder label="학습" />;
}
