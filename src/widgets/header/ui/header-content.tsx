import { Link, useNavigate } from '@tanstack/react-router';

import { tokenManager } from '@/shared/api';
import Logo from '@/shared/assets/icons/logo.svg?react';
import Profile from '@/shared/assets/icons/profile2.svg?react';
import { cn } from '@/shared/lib/cn';
import { getProfileColor } from '@/shared/lib/ProfileColor';

interface HeaderContentProps {
  profileImageNum: number;
  navList: { to: string; label: string }[];
  variant?: 'transparent' | 'solid';
}

const headerVariantClass = {
  transparent: {
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

export default function HeaderContent({
  profileImageNum,
  navList,
  variant = 'transparent',
}: HeaderContentProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-full transition-all duration-1000',
        'after:p-px after:pointer-events-none after:absolute after:inset-0 after:rounded-full',
        'after:bg-linear-to-l after:from-white/60 after:via-white/20 after:to-white/60',
        'after:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:[mask-origin:content-box,border-box] after:[mask-clip:content-box,border-box] after:mask-exclude',
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
          showActiveStyle={variant === 'transparent'}
        />

        <HeaderUserMenu
          profileImageNum={profileImageNum}
          className={headerVariantClass[variant].userMenuText}
        />
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

function HeaderUserMenu({
  profileImageNum,
  className,
}: {
  profileImageNum: number;
  className?: string;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenManager.clearTokens();
    navigate({ from: '/', replace: true });
  };

  return (
    <div className={cn('flex items-center gap-5 heading2', className)}>
      <Profile
        style={{ color: getProfileColor(profileImageNum) }}
        className="size-12.5 aspect-square"
      />

      <button type="button" onClick={handleLogout} className="cursor-pointer">
        로그아웃
      </button>
    </div>
  );
}
