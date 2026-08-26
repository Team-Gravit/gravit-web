import HeaderBackButton from './header-back-button';
import MobilePageHeader from './mobile-page-header';

interface BackButtonMobileHeaderProps {
  pageTitle: string;
  rightSlot?: React.ReactNode;
  className?: string;
  fallbackTo?: string;
  backPath?: string;
}

function BackButtonMobileHeader({ fallbackTo, backPath, ...rest }: BackButtonMobileHeaderProps) {
  return (
    <MobilePageHeader
      leftSlot={<HeaderBackButton fallbackTo={fallbackTo} backPath={backPath} />}
      {...rest}
    />
  );
}

export default BackButtonMobileHeader;
