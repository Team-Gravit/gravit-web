import type { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { HEADER_NAV_ITEMS } from '@/shared/config';
import { cn } from '@/shared/lib/cn';
import { GravitLogo } from '@/shared/ui/logo';
import { ProfileAvatar, useUser } from '@/entities/user';
import { LogoutButton } from '@/features/auth-logout';

export type HeaderVariant = 'overlay' | 'solid';

export interface HeaderProps {
  variant?: HeaderVariant;
  /** 알림 트리거 슬롯. 위젯 간 cross-slice 를 피하려 app 이 NotificationPopover 를 주입한다. */
  notificationSlot?: ReactNode;
}

const VARIANT_CLASS: Record<HeaderVariant, { bar: string; text: string }> = {
  overlay: { bar: 'bg-black/10 backdrop-blur-[66px]', text: 'text-text-1-w' },
  solid: { bar: 'bg-bg-1 backdrop-blur-[66px]', text: 'text-text-1' },
};

export function Header({ variant = 'solid', notificationSlot }: HeaderProps) {
  const style = VARIANT_CLASS[variant];
  const navigate = useNavigate();

  const handleLoggedOut = () => {
    void navigate({ to: '/', replace: true });
  };

  return (
    <header data-slot="header" className="fixed inset-x-0 top-0 z-50 px-15 py-5">
      {/*
        로고와 사용자 메뉴의 폭이 달라도 내비게이션이 가운데에 오도록 좌우에 같은 비율의 열을 둔다.
        가운데 열은 시안의 543px까지 늘어나며, 좁은 화면에서는 메뉴 사이 간격이 줄어든다.
      */}
      <div
        className={cn(
          'glass-morphism-border relative grid h-18 w-full grid-cols-[1fr_minmax(0,543px)_1fr] items-center gap-x-10 rounded-full px-8 after:rounded-full',
          style.bar,
          style.text,
        )}
      >
        <Link
          to="/main"
          aria-label="홈으로 이동"
          className="inline-flex justify-self-start rounded-4 outline-none focus-visible:ring-3 focus-visible:ring-purple-200"
        >
          <GravitLogo
            variant={variant === 'overlay' ? 'mono' : 'gradient'}
            aria-label="Gravit"
            role="img"
            className="h-6 w-auto"
          />
        </Link>

        <nav aria-label="주요 메뉴">
          {/* 넓은 화면에서는 남은 폭으로 메뉴 간격을 늘리고, 좁은 화면에서는 gap을 최소 간격으로 쓴다. */}
          <ul className="flex items-center justify-between gap-6 text-heading2">
            {HEADER_NAV_ITEMS.map((item) => (
              // 메뉴 이름은 한 줄로 유지한다. 폭이 부족해도 한글이 글자 단위로 끊기지 않게 한다.
              <li key={item.to} className="whitespace-nowrap">
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

        <HeaderUserMenu onLoggedOut={handleLoggedOut} notificationSlot={notificationSlot} />
      </div>
    </header>
  );
}

function HeaderUserMenu({
  onLoggedOut,
  notificationSlot,
}: {
  onLoggedOut: () => void;
  notificationSlot?: ReactNode;
}) {
  const { data: user } = useUser();

  return (
    <div className="flex items-center gap-4 justify-self-end">
      {/* 사용자 정보를 받아야 알림과 아바타를 표시한다. 조회 실패 시에도 로그아웃은 남긴다. */}
      {user && (
        <div className="flex items-center gap-5">
          {notificationSlot}
          <ProfileAvatar colorNumber={user.profileImgNumber} className="size-8" />
        </div>
      )}
      <LogoutButton onLoggedOut={onLoggedOut} className="text-heading2 font-medium" />
    </div>
  );
}
