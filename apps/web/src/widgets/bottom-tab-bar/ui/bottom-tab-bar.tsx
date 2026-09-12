import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';

import { BOTTOM_TAB_ITEMS } from '../model/nav';

/** 모바일 하단 네비게이션. 활성 탭은 채움 아이콘 + main 라벨로 표시한다. */
export function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-(--bottom-tab-height) bg-white shadow-[0_4px_3.5px_rgba(0,0,0,0.1)]">
      <ul className="flex h-full items-center justify-around">
        {BOTTOM_TAB_ITEMS.map(({ label, to, icon: Icon, activeIcon: ActiveIcon }) => (
          <li key={to} className="w-1/4">
            <Link to={to} className="flex flex-col items-center justify-center gap-1">
              {({ isActive }) => (
                <>
                  {isActive ? <ActiveIcon /> : <Icon />}
                  <span className={cn('text-caption1', isActive ? 'text-main' : 'text-icon')}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
