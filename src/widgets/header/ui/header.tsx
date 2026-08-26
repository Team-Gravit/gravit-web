import { DEFAULT_HEADER_NAV_LIST } from '../config/nav';
import HeaderContent, { type HeaderVariant } from './header-content';

function Header({ variant }: { variant: HeaderVariant }) {
  return (
    <header className="fixed left-0 top-0 z-50 w-full px-15 py-5">
      <HeaderContent navList={DEFAULT_HEADER_NAV_LIST} variant={variant} />
    </header>
  );
}

export default Header;
