import { useState } from 'react';

import {
  InquiryStatusChip,
  InquiryTypeChip,
  useInquiryDetail,
  type InquiryDetailResponse,
  type InquirySummaryResponse,
} from '@/entities/inquiry';
import { cn } from '@/shared/lib/cn';
import { formatISODate } from '@/shared/lib/date';
import { Icon } from '@/shared/ui/icon';
import { Spinner } from '@/shared/ui/spinner';

interface InquiryListItemProps {
  inquiry: InquirySummaryResponse;
}

/** legacy `my-inquiries-list-item.tsx`를 그대로 옮겼다. 트리거만 접근성 위해 button으로 바꿨다. */
export function InquiryListItem({ inquiry }: InquiryListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useInquiryDetail(inquiry.id, isOpen);

  return (
    <li className="border-b border-divider-2 bg-white p-4 last:border-none md:px-8 md:py-7">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-center gap-2 text-left"
      >
        <div className="flex-1">
          <InquiryTypeChip type={inquiry.type} className="mb-2 md:mb-4" />
          <h4 className="text-headline2 text-text-1 md:mb-2 md:text-heading1">{inquiry.title}</h4>
          <span className="text-caption1 text-text-4">{formatISODate(inquiry.createdAt)}</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <InquiryStatusChip status={inquiry.status} />
          <Icon
            name="chevron-down"
            className={cn(
              'size-4 text-icon-disabled transition-transform md:size-6',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          'grid transition-all duration-300',
          isOpen ? 'grid-rows-[1fr] pt-4' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="flex h-[265px] w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            data && <InquiryDetail detail={data} />
          )}
        </div>
      </div>
    </li>
  );
}

function InquiryDetail({ detail }: { detail: InquiryDetailResponse }) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-[130px] flex-col gap-1 rounded-12 border border-divider-1 p-4 md:p-6">
        <span className="text-caption1 text-text-4">문의 내용</span>
        <p className="flex-1 overflow-scroll scrollbar-hide text-body2-normal text-text-1 md:text-body1-normal">
          {detail.content}
        </p>
      </div>

      {detail.answer && (
        <div className="flex min-h-[130px] flex-col gap-1 rounded-12 border border-purple-200 bg-purple-50 p-4 md:p-6">
          <span className="text-caption1 text-main-1">답변</span>
          <p className="flex-1 overflow-scroll scrollbar-hide text-body2-reading text-text-1 md:text-body1-normal">
            {detail.answer.content}
          </p>
        </div>
      )}

      {!detail.answer && (
        <div className="flex min-h-[130px] flex-col items-center justify-center rounded-12 border border-divider-1 bg-bg-1 p-4 md:p-6">
          <Icon name="calendar-timer" className="mb-3 text-icon-disabled" />
          <p className="mb-0.5 text-label1 text-text-3 md:mb-0">답변 대기 중입니다</p>
          <p className="text-center text-caption1 text-text-4">
            문의해주신 내용을 확인하고 있어요.
            <br className="mb-1 md:hidden" />
            순차적으로 답변드릴게요.
          </p>
        </div>
      )}
    </div>
  );
}
