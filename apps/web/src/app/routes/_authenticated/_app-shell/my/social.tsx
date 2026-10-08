import { createFileRoute } from '@tanstack/react-router';

import { SocialTab } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/social')({
  component: SocialTab,
});
