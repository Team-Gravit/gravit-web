import HeaderBackButton from './header-back-button';
import MobilePageHeader from './mobile-page-header';

interface BackButtonMobileHeaderProps {
  pageTitle: string;
  rightSlot?: React.ReactNode;
  className?: string;
  fallbackTo?: string;
  backPath?: string;
}

function BackButtonMobileHeader(props: BackButtonMobileHeaderProps) {
  return (
    <MobilePageHeader
      leftSlot={<HeaderBackButton fallbackTo={props.fallbackTo} backPath={props.backPath} />}
      {...props}
    />
  );
}

export default BackButtonMobileHeader;
