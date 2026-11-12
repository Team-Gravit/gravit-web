import { Skeleton } from '@/shared/ui/skeleton';

/**
 * 공지 목록 로딩 스켈레톤 한 행. `notice-list-item.tsx`의 행 높이·패딩·요소 수치를 그대로
 * 미러링해 로드 완료 시 레이아웃 시프트가 없게 한다. (아이템 구조를 바꾸면 이 파일도 갱신한다.)
 */
export function NoticeListItemSkeleton() {
  return (
    <li className="border-b border-divider-2 bg-white last:border-none">
      <div className="flex h-[75px] items-center gap-4 px-4 md:h-[106px] md:gap-6 md:px-8">
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2">
          <Skeleton variant="text" className="w-40 text-headline2 md:w-64 md:text-heading1" />
          <Skeleton variant="text" className="w-20 text-caption1" />
        </div>
        <Skeleton variant="circular" className="size-6 shrink-0" />
      </div>
    </li>
  );
}
