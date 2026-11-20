import { Link } from '@tanstack/react-router';

import { CardRetryStatus, CardStatus, CardStatusButton } from '@/shared/ui/card';
import type { InquirySummaryResponse } from '@/entities/inquiry';

import { InquiryListItem } from './inquiry-list-item';
import { MyInquiriesListSkeleton } from './my-inquiries-list-skeleton';

interface MyInquiriesListProps {
  inquiries: InquirySummaryResponse[];
  isPending: boolean;
  /** 받은 문의 없이 조회가 실패했는지. 빈 상태 대신 재시도를 보여 준다. */
  hasLoadError: boolean;
  onRetry: () => Promise<unknown>;
}

const STATUS_BOX_CLASS = 'flex h-[300px] w-full rounded-8 bg-white md:rounded-12';
const EMPTY_MESSAGE = '등록된 문의 내역이 없어요.\n궁금한 점이 있다면 문의하기를 통해 남겨 주세요.';

/** legacy `my-inquiries-list.tsx` 기반. 무한스크롤은 페이지네이션으로, 버튼은 공통 Button으로 바꿨다. */
export function MyInquiriesList({
  inquiries,
  isPending,
  hasLoadError,
  onRetry,
}: MyInquiriesListProps) {
  return (
    <div className="flex-1">
      {isPending && <MyInquiriesListSkeleton />}
      {!isPending && hasLoadError && (
        <div className={STATUS_BOX_CLASS}>
          <CardRetryStatus sectionName="문의 내역" onRetry={onRetry} />
        </div>
      )}
      {!isPending && !hasLoadError && inquiries.length > 0 && (
        <ul className="overflow-hidden rounded-8 md:rounded-12">
          {inquiries.map((item) => (
            <InquiryListItem key={item.id} inquiry={item} />
          ))}
        </ul>
      )}
      {!isPending && !hasLoadError && inquiries.length === 0 && (
        <div className={STATUS_BOX_CLASS}>
          <CardStatus
            message={EMPTY_MESSAGE}
            className="whitespace-pre-line"
            action={
              <CardStatusButton asChild>
                <Link to="/settings/inquiry/new">문의하기</Link>
              </CardStatusButton>
            }
          />
        </div>
      )}
    </div>
  );
}
