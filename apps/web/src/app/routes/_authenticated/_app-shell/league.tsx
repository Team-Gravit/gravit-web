import { createFileRoute } from '@tanstack/react-router';

import { SPACE_TOP_COLOR } from '@/shared/config';
import { LeaguePage } from '@/pages/league';

export const Route = createFileRoute('/_authenticated/_app-shell/league')({
  staticData: {
    headerVariant: 'overlay',
    statusBarStyle: 'light',
    browserTopColor: SPACE_TOP_COLOR,
  },
  component: LeaguePage,
});
