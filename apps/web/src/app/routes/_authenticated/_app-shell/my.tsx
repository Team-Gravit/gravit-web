import { createFileRoute } from '@tanstack/react-router';

import { MyPage } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my')({
  staticData: { headerVariant: 'solid' },
  component: MyPage,
});
