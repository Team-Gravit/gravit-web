import { Link } from '@tanstack/react-router';

import { NAV_ITEMS } from '@/shared/config';
import { cn } from '@/shared/lib/cn';

import { TAB_ICONS } from '../model/nav';

export function BottomTabBar() {
  return (
    <nav
      data-slot="bottom-tab-bar"
      aria-label="하단 탭"
      className="fixed inset-x-0 bottom-0 z-40 h-(--bottom-tab-height) bg-white shadow-[0_4px_7px_rgba(0,0,0,0.1)]"
    >
      <ul className="flex h-full items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const { idle: Icon, active: ActiveIcon } = TAB_ICONS[item.to];

          return (
            <li key={item.to} className="w-1/4">
              <Link to={item.to} className="flex flex-col items-center justify-center gap-1">
                {({ isActive }) => (
                  <>
                    {isActive ? <ActiveIcon /> : <Icon />}
                    <span className={cn('text-caption1', isActive ? 'text-main' : 'text-icon')}>
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
