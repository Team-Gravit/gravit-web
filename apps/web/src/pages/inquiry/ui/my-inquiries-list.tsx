import { Link } from '@tanstack/react-router';

import type { InquirySummaryResponse } from '@/entities/inquiry';
import { Button } from '@/shared/ui/button';

import { InquiryListItem } from './inquiry-list-item';
import { MyInquiriesListSkeleton } from './my-inquiries-list-skeleton';

interface MyInquiriesListProps {
  inquiries: InquirySummaryResponse[];
  isPending: boolean;
}

/** legacy `my-inquiries-list.tsx` 기반. 무한스크롤은 페이지네이션으로, 버튼은 공통 Button으로 바꿨다. */
export function MyInquiriesList({ inquiries, isPending }: MyInquiriesListProps) {
  return (
    <div className="flex-1">
      {isPending && <MyInquiriesListSkeleton />}
      {!isPending && inquiries.length > 0 && (
        <ul className="overflow-hidden rounded-8 md:rounded-12">
          {inquiries.map((item) => (
            <InquiryListItem key={item.id} inquiry={item} />
          ))}
        </ul>
      )}
      {!isPending && inquiries.length === 0 && (
        <div className="flex h-[300px] w-full flex-col items-center justify-center gap-8 rounded-8 bg-white md:rounded-12">
          <div className="text-center">
            <p className="mb-2 md:mb-3 text-headline1 md:text-heading1 text-text-2">
              등록된 문의 내역이 없어요
            </p>
            <p className="text-label1 md:text-headline1 text-text-4">
              궁금한 점이 있다면 문의하기를 통해 남겨주세요.
            </p>
          </div>
          <Button asChild size="cta" className="w-auto text-headline2 px-9">
            <Link to="/settings/inquiry/new">문의하기</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
