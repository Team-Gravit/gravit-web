import { Link } from '@tanstack/react-router';

import { useUserInfo } from '@/entities/sidebar/api/useUserInfo';
import useLogout from '@/features/auth/logout';
import Logo from '@/shared/assets/icons/logo.svg?react';
import Profile from '@/shared/assets/icons/profile2.svg?react';
import { cn } from '@/shared/lib/cn';
import { getProfileColor } from '@/shared/lib/ProfileColor';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

export type HeaderVariant = 'overlay' | 'solid';

interface HeaderContentProps {
  navList: { to: string; label: string }[];
  variant: HeaderVariant;
}

const headerVariantClass = {
  overlay: {
    background: 'bg-black/10 backdrop-blur-[66px]',
    navText: 'text-white',
    userMenuText: 'text-bg-1',
    logoColor: 'text-bg-1',
  },
  solid: {
    background: 'bg-bg-1 shadow-[0_4px_32px_rgba(0,0,0,0.05)]',
    navText: 'text-text-1',
    userMenuText: 'text-text-4',
    logoColor: 'text-[var(--primitive-purple-600)]',
  },
};

export default function HeaderContent({ navList, variant }: HeaderContentProps) {
  return (
    <div
      className={cn(
        'relative h-18 w-full rounded-full transition-all duration-1000',
        'glass-morphism-border after:rounded-full',
        headerVariantClass[variant].background,
      )}
    >
      <div className="relative rounded-full z-10 text-white text-lg flex h-full justify-between items-center px-8 p-2.5">
        <div className="flex items-center gap-5">
          <Logo className={cn('w-25', headerVariantClass[variant].logoColor)} />
        </div>

        <HeaderNav
          navList={navList}
          className={headerVariantClass[variant].navText}
          showActiveStyle={variant === 'overlay'}
        />

        <HeaderUserMenu className={headerVariantClass[variant].userMenuText} />
      </div>
    </div>
  );
}

function HeaderNav({
  navList,
  className,
  showActiveStyle,
}: {
  navList: { to: string; label: string }[];
  className?: string;
  showActiveStyle?: boolean;
}) {
  return (
    <nav>
      <ul className={cn('flex items-center gap-18 heading2', className)}>
        {navList.map((navItem) => (
          <li key={navItem.label}>
            <Link
              className="p-2"
              activeProps={
                showActiveStyle ? { className: 'underline underline-offset-8' } : undefined
              }
              to={navItem.to}
            >
              {navItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HeaderUserMenu({ className }: { className?: string }) {
  const handleLogout = useLogout();
  const { data, isPending } = useUserInfo();

  let userMenuContent = <div />;

  if (isPending) {
    userMenuContent = (
      <>
        <Skeleton variant={'circular'} className="size-8 bg-white/10" />
        <Skeleton textSize={'heading2'} width={62} className="bg-white/10" />
      </>
    );
  }

  if (data?.profileImgNumber) {
    userMenuContent = (
      <>
        <Profile
          style={{ color: getProfileColor(data.profileImgNumber) }}
          className="size-8 aspect-square"
        />
        <button type="button" onClick={handleLogout} className="cursor-pointer">
          로그아웃
        </button>
      </>
    );
  }

  return <div className={cn('flex items-center gap-5 heading2', className)}>{userMenuContent}</div>;
}
