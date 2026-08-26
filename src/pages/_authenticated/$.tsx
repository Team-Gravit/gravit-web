import { createFileRoute } from '@tanstack/react-router';

import useResponsive from '@/shared/model/use-responsive';
import Header from '@/widgets/header/ui/header';
import NotFoundPage from '@/widgets/status-widget/not-found-page';

function AuthenticatedNotFound() {
  const { isDesktop } = useResponsive();
  return (
    <>
      {isDesktop && <Header />}
      <NotFoundPage />
    </>
  );
}

export const Route = createFileRoute('/_authenticated/$')({
  component: AuthenticatedNotFound,
});
