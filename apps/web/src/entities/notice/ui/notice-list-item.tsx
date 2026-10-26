import { Link, type LinkProps } from '@tanstack/react-router';

import { formatISODate } from '@/shared/lib/date';
import { Icon } from '@/shared/ui/icon';

import type { NoticeSummaryResponse } from '../api';

export interface NoticeListItemProps {
  notice: NoticeSummaryResponse;
  /** 지정하면 행 전체가 해당 경로로 가는 링크가 된다. 없으면 정적 표시(경로 결정은 상위가 한다). */
  link?: LinkProps;
}

/**
 * 공지 목록의 한 행. 핀 공지는 제목 앞에 핀 아이콘이 붙는다.
 * 행 높이(75/106)를 고정해 스켈레톤(`NoticeListItemSkeleton`)과 수치를 맞춘다.
 */
export function NoticeListItem({ notice, link }: NoticeListItemProps) {
  const row = (
    <div className="flex h-[75px] items-center gap-4 px-4 md:h-[106px] md:gap-6 md:px-8">
      <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          {notice.pinned && (
            <Icon
              name="pin-fill"
              aria-label="고정 공지"
              className="size-5 shrink-0 text-cta md:size-6"
            />
          )}
          <span className="truncate text-headline2 text-text-1 md:text-heading1">
            {notice.title}
          </span>
        </div>
        <span className="text-caption1 text-text-4">{formatISODate(notice.publishedAt)}</span>
      </div>
      <Icon name="chevron-right" className="size-6 shrink-0 text-text-4" />
    </div>
  );

  return (
    <li className="border-b border-divider-2 bg-white last:border-none">
      {link ? (
        <Link {...link} className="block transition-colors hover:bg-bg-1">
          {row}
        </Link>
      ) : (
        row
      )}
    </li>
  );
}
