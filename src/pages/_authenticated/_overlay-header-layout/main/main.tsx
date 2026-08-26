import useResponsive from '@/shared/model/use-responsive';

import MainDesktop from './_components/main-desktop';
import MainMobile from './_components/main-mobile';

export default function MainPage() {
  const { isMobile } = useResponsive();

  return isMobile ? <MainMobile /> : <MainDesktop />;
}
