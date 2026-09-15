import { Link, useNavigate } from '@tanstack/react-router';

import { NAV_ITEMS } from '@/shared/config';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { GravitLogo } from '@/shared/ui/logo';
import { ProfileAvatar, useUser } from '@/entities/user';
import { LogoutButton } from '@/features/auth-logout';

export type HeaderVariant = 'overlay' | 'solid';

export interface HeaderProps {
  variant?: HeaderVariant;
}

const VARIANT_CLASS: Record<HeaderVariant, { bar: string; text: string }> = {
  overlay: { bar: 'bg-black/10 backdrop-blur-[66px]', text: 'text-text-1-w' },
  solid: { bar: 'bg-bg-1 backdrop-blur-[66px]', text: 'text-text-1' },
};

export function Header({ variant = 'solid' }: HeaderProps) {
  const style = VARIANT_CLASS[variant];
  const navigate = useNavigate();

  const handleLoggedOut = () => {
    void navigate({ to: '/', replace: true });
  };

  return (
    <header data-slot="header" className="fixed inset-x-0 top-0 z-50 px-15 py-5">
      <div
        className={cn(
          'glass-morphism-border relative flex h-18 w-full items-center justify-between rounded-full px-8 after:rounded-full',
          style.bar,
          style.text,
        )}
      >
        <GravitLogo
          variant={variant === 'overlay' ? 'mono' : 'gradient'}
          aria-label="Gravit"
          role="img"
          className="h-6 w-auto"
        />

        <nav aria-label="주요 메뉴">
          <ul className="flex items-center gap-20 text-heading2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                {/* Link가 현재 경로에 자동으로 붙이는 aria-current 속성으로 활성 상태를 표시한다. */}
                <Link
                  to={item.to}
                  className="inline-block border-b-[1.5px] border-transparent py-0.5 aria-[current=page]:border-current"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <HeaderUserMenu onLoggedOut={handleLoggedOut} />
      </div>
    </header>
  );
}

function HeaderUserMenu({ onLoggedOut }: { onLoggedOut: () => void }) {
  const { data: user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {/* 프로필 표시 여부와 무관하게 로그아웃은 항상 렌더링한다. */}
      {user ? (
        <div className="flex items-center gap-5">
          <Icon name="bell" />
          <ProfileAvatar colorNumber={user.profileImgNumber} className="size-8" />
        </div>
      ) : null}
      <LogoutButton onLoggedOut={onLoggedOut} className="text-heading2 font-medium" />
    </div>
  );
}
