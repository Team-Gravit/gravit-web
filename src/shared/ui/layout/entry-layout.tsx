import { useLocation, useNavigate } from '@tanstack/react-router';

import { tokenManager } from '@/shared/api';
import LeftArrow from '@/shared/assets/_icons/chevron-left.svg?react';
import backgroundImage from '@/shared/assets/_images/background/desktop-background.png';
import TextLogo from '@/shared/assets/_images/logo/logo.svg?react';
import { cn } from '@/shared/lib/cn';
import useResponsive from '@/shared/model/use-responsive';

import MobilePageHeader from './header/mobile-page-header';

interface EntryLayoutProps {
  children: React.ReactNode;
  className?: string;
}

function EntryLayout({ children, className }: EntryLayoutProps) {
  const { isMobile } = useResponsive();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <main
      className={cn('h-full flex flex-col ', !isMobile && 'bg-cover bg-no-repeat bg-center')}
      style={{
        backgroundImage: !isMobile ? `url(${backgroundImage})` : undefined,
      }}
    >
      {isMobile && pathname !== '/success' && (
        <MobilePageHeader
          pageTitle="로그인"
          leftSlot={pathname === '/onboarding' ? <OnboardingBackButton /> : <></>}
        />
      )}

      <section
        className={cn(
          'flex-1 flex flex-col justify-end md:justify-center md:items-center px-4 pt-5 pb-10 w-full',
          className,
        )}
      >
        {!isMobile && (
          <div className="space-y-4 text-center mb-8">
            <TextLogo className="w-[630px] h-[90px] text-text-1-w" />
            <p className="text-text-1-w text-heading2">그래빗과 함께 CS 지식을 마스터해요!</p>
          </div>
        )}

        {children}
      </section>
    </main>
  );
}

export default EntryLayout;

function OnboardingBackButton() {
  const navigate = useNavigate();

  const handleCancelOnboarding = () => {
    tokenManager.clearTokens();
    navigate({ to: '/' });
  };

  return (
    <button
      type="button"
      onClick={handleCancelOnboarding}
      className="inline-flex items-center justify-center size-12"
    >
      <LeftArrow />
    </button>
  );
}
