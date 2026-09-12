import { createFileRoute } from '@tanstack/react-router';

import { LearningPage } from '@/pages/learning';

export const Route = createFileRoute('/_authenticated/_app-shell/learning')({
  staticData: { headerVariant: 'solid' },
  component: LearningPage,
});
