import { useLocation } from '@tanstack/react-router';

import { useUserInfo } from '@/entities/sidebar/api/useUserInfo';

import { DEFAULT_HEADER_NAV_LIST } from '../config/nav';
import HeaderContent from './header-content';

function Header() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { data, isPending } = useUserInfo();

  if (isPending) return null;
  if (!data) return null;

  const isMainPage = pathname === '/main';

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-15 py-5">
      <HeaderContent
        navList={DEFAULT_HEADER_NAV_LIST}
        profileImageNum={data.profileImgNumber}
        variant={isMainPage ? 'transparent' : 'solid'}
      />
    </header>
  );
}

export default Header;
