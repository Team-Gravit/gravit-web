import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { useLogout } from '../model/use-logout';

export interface LogoutButtonProps extends Omit<ComponentProps<'button'>, 'onClick' | 'children'> {
  /** 세션과 캐시를 비운 뒤 호출된다. 이동 목적지는 호출부가 정한다. */
  onLoggedOut: () => void;
}

/** 헤더 variant에 맞는 글자색은 호출부가 `className`으로 지정한다. */
export function LogoutButton({ onLoggedOut, className, ...props }: LogoutButtonProps) {
  const logout = useLogout({ onSuccess: onLoggedOut });

  return (
    <button
      type="button"
      data-slot="logout-button"
      onClick={logout}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      로그아웃
    </button>
  );
}
