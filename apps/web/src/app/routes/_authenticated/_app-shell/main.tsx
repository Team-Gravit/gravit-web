import { createFileRoute } from '@tanstack/react-router';

import { SPACE_TOP_COLOR } from '@/shared/config';
import { MainPage } from '@/pages/main';

export const Route = createFileRoute('/_authenticated/_app-shell/main')({
  staticData: {
    headerVariant: 'overlay',
    statusBarStyle: 'light',
    browserTopColor: SPACE_TOP_COLOR,
  },
  component: MainPage,
});
