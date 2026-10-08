import { createFileRoute } from '@tanstack/react-router';

import { MainPage } from '@/pages/main';

export const Route = createFileRoute('/_authenticated/_app-shell/main')({
  staticData: { headerVariant: 'overlay' },
  component: MainPage,
});
