import { useLocation } from '@tanstack/react-router';

import { DEFAULT_HEADER_NAV_LIST } from '../config/nav';
import HeaderContent from './header-content';

function Header() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const isMainPage = pathname === '/main';

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-15 py-5">
      <HeaderContent
        navList={DEFAULT_HEADER_NAV_LIST}
        variant={isMainPage ? 'transparent' : 'solid'}
      />
    </header>
  );
}

export default Header;
