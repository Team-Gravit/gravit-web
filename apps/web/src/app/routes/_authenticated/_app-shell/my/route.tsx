import { createFileRoute } from '@tanstack/react-router';

import { SPACE_TOP_COLOR } from '@/shared/config';
import { MyPageLayout } from '@/pages/my';

export const Route = createFileRoute('/_authenticated/_app-shell/my')({
  staticData: {
    headerVariant: 'solid',
    statusBarStyle: 'light',
    browserTopColor: SPACE_TOP_COLOR,
  },
  component: MyPageLayout,
});
