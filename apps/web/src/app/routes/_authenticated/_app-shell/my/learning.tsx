import { createFileRoute } from '@tanstack/react-router';

import { LearningTab } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/learning')({
  component: LearningTab,
});
