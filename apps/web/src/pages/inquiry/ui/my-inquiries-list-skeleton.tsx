import { Skeleton } from '@/shared/ui/skeleton';

/** 한 화면에 보일 문의 개수만큼 스켈레톤 행을 그린다. */
const SKELETON_ROW_COUNT = 5;

/**
 * 문의 목록 로딩 스켈레톤. `inquiry-list-item.tsx`의 컨테이너·패딩·요소 높이를 그대로
 * 미러링해 로드 완료 시 레이아웃 시프트가 없게 한다. (항목 구조를 바꾸면 이 파일도 갱신한다.)
 */
export function MyInquiriesListSkeleton() {
  return (
    <ul className="overflow-hidden rounded-8 md:rounded-12">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <li
          key={index}
          className="border-b border-divider-2 bg-white p-4 last:border-none md:px-8 md:py-7"
        >
          <div className="flex w-full items-center justify-center gap-2">
            {/* Skeleton은 inline-block이라 flex-col로 세로 배치해야 데스크톱 넓은 폭에서 겹치지 않는다. */}
            <div className="flex flex-1 flex-col items-start">
              {/* 유형 칩 */}
              <Skeleton
                variant="block"
                className="mb-2 h-6 w-16 rounded-full md:mb-4 md:h-8 md:w-24"
              />
              {/* 제목 */}
              <Skeleton
                variant="text"
                className="w-40 text-headline2 mb-2 md:mb-2.5 md:text-heading1"
              />
              {/* 날짜 */}
              <Skeleton variant="text" className="w-20 text-caption1 md:text-body2-normal" />
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              {/* 상태 칩 */}
              <Skeleton variant="block" className="h-6 w-16 rounded-full md:h-8 md:w-24" />
              {/* 펼침 화살표 */}
              <Skeleton variant="circular" className="size-4 md:size-6" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
