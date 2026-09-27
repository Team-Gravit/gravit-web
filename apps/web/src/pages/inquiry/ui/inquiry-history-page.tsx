import { useMyInquiries } from '@/entities/inquiry';
import { Pagination } from '@/shared/ui/pagination';

import { MyInquiriesList } from './my-inquiries-list';

interface InquiryHistoryPageProps {
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * 문의 내역 확인 화면. legacy `settings/inquiry/index.tsx`의 헤더 + 목록을 그대로 옮기고,
 * 무한스크롤 대신 페이지네이션을 붙였다. 페이지는 URL search가 소유한다.
 */
export function InquiryHistoryPage({ page, onPageChange }: InquiryHistoryPageProps) {
  const { data, isPending } = useMyInquiries(page);

  const inquiries = data?.contents ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="flex flex-1 flex-col gap-2 md:gap-3">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-headline2 md:text-heading1">
          문의 내역<span className="ml-2 text-main-1">{totalElements}</span>
        </h3>
        <span className="text-caption1 text-text-4">최신순</span>
      </div>

      <MyInquiriesList inquiries={inquiries} isPending={isPending} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      )}
    </div>
  );
}
