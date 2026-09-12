import { Link, useNavigate } from '@tanstack/react-router';

import { ProfileAvatar, useUser } from '@/entities/user';
import { useLogout } from '@/features/auth-logout';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { GravitLogo } from '@/shared/ui/logo';

import { HEADER_NAV_ITEMS } from '../model/nav';

export type HeaderVariant = 'overlay' | 'solid';

export interface HeaderProps {
  variant?: HeaderVariant;
}

// variant별 표면·글자색. overlay = 투명 글래스(밝은 배경 위), solid = 흰 배경.
const VARIANT_CLASS: Record<HeaderVariant, { bar: string; text: string }> = {
  overlay: { bar: 'bg-black/10 backdrop-blur-[66px]', text: 'text-text-1-w' },
  solid: { bar: 'bg-bg-1 backdrop-blur-[66px]', text: 'text-text-1' },
};

/** 데스크톱 상단 헤더. 로고·네비게이션·유저 메뉴를 담는다. variant로 표면을 바꾼다. */
export function Header({ variant = 'solid' }: HeaderProps) {
  const style = VARIANT_CLASS[variant];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-15 py-5">
      <div
        className={cn(
          'glass-morphism-border relative flex h-18 w-full items-center justify-between rounded-full px-8 after:rounded-full',
          style.bar,
        )}
      >
        <GravitLogo
          variant={variant === 'overlay' ? 'mono' : 'gradient'}
          className={cn('h-6 w-auto', variant === 'overlay' && 'text-text-1-w')}
        />

        <nav>
          <ul className={cn('flex items-center gap-20 text-heading2', style.text)}>
            {HEADER_NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="p-2"
                  activeProps={{ className: 'underline underline-offset-8' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <HeaderUserMenu textClassName={style.text} />
      </div>
    </header>
  );
}

function HeaderUserMenu({ textClassName }: { textClassName: string }) {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const logout = useLogout({ onSuccess: () => navigate({ to: '/' }) });

  return (
    <div className={cn('flex items-center gap-4', textClassName)}>
      {user && (
        <div className="flex items-center gap-5">
          <Icon name="bell" />
          <ProfileAvatar colorNumber={user.profileImgNumber} className="size-8" />
        </div>
      )}
      <button type="button" onClick={logout} className="cursor-pointer text-heading2 font-medium">
        로그아웃
      </button>
    </div>
  );
}
