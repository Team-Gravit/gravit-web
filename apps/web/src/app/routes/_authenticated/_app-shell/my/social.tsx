import { createFileRoute } from '@tanstack/react-router';

import { MyTabPlaceholder } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my/social')({
  component: SocialTab,
});

function SocialTab() {
  return <MyTabPlaceholder label="소셜" />;
}
