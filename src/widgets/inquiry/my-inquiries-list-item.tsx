import { useState } from 'react';

import { useGetMyInquiryDetail } from '@/shared/api/@generated/inquiry-api/inquiry-api';
import type { InquiryDetailResponse, InquirySummaryResponse } from '@/shared/api/@generated/model';
import TimerIcon from '@/shared/assets/_icons/timer.svg?react';
import ChevronDownArrow from '@/shared/assets/icons/arrow-down-icon.svg?react';
import LoadingSpinner from '@/shared/assets/icons/spinner.svg?react';
import { cn } from '@/shared/lib/cn';
import { formatISODate } from '@/shared/lib/formatDate';

import { INQUIRY_FORM_DROPDOWN_ITEMS } from './model/inquiry-config';

interface MyInquiriesListItemProps {
  inquiry: InquirySummaryResponse;
}

const getInquiryTypeLabel = (type: string) => {
  return INQUIRY_FORM_DROPDOWN_ITEMS.find((item) => item.value === type)?.label || '기타';
};

export default function MyInquiriesListItem({ inquiry }: MyInquiriesListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetMyInquiryDetail(inquiry.id, {
    query: {
      enabled: isOpen,
    },
  });

  return (
    <li
      onClick={() => setIsOpen((prev) => !prev)}
      className="p-4 md:px-8 md:py-7 bg-white  border-b border-divider-2 last:border-none"
    >
      <div className="flex items-center justify-center w-full gap-2">
        <div className="flex-1">
          <span className="py-1 px-2 md:px-4 mb-2 md:mb-4 inline-block text-center rounded-full border border-main-2 text-main-2 text-caption1 md:text-body1-normal">
            {getInquiryTypeLabel(inquiry.type)}
          </span>
          <h4 className="text-headline1 md:text-heading1 text-text1 md:mb-2">{inquiry.title}</h4>
          <span className="text-caption1 text-text-4">{formatISODate(inquiry.createdAt)}</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <MyInquiriesListItemStatusChip status={inquiry.status as 'PENDING' | 'RESOLVED'} />
          <ChevronDownArrow
            className={cn(
              'size-4 md:size-6 text-icon-disabled transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          'grid transition-all duration-300',
          isOpen ? 'grid-rows-[1fr] pt-4' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="h-[265px] w-full flex items-center justify-center">
              <LoadingSpinner className="size-6 animate-spin" />
            </div>
          ) : (
            data && <MyInquiryDetail inquiryDetail={data!} />
          )}
        </div>
      </div>
    </li>
  );
}

function MyInquiriesListItemStatusChip({ status }: { status: 'PENDING' | 'RESOLVED' }) {
  return (
    <span
      className={cn(
        'text-caption1 md:text-body1-normal px-2 md:px-4 py-1 rounded-full border',
        status === 'PENDING' && 'text-text-4 border-divider-2',
        status === 'RESOLVED' && 'bg-main-2 border-main-2 text-white',
      )}
    >
      {status === 'PENDING' ? '답변 대기' : '답변 완료'}
    </span>
  );
}

function MyInquiryDetail({ inquiryDetail }: { inquiryDetail: InquiryDetailResponse }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 p-4 md:p-6 rounded-xl border border-divider-1 min-h-[130px]">
        <span className="text-caption1 text-text-4">문의 내용</span>
        <p className="flex-1 overflow-scroll text-body2-normal md:text-body1-normal text-text-1">
          {inquiryDetail.content}
        </p>
      </div>

      {inquiryDetail.answer && (
        <div className="flex flex-col gap-1 p-4 md:p-6 rounded-xl border border-[var(--primitive-purple-200)] bg-[var(--primitive-purple-50)] min-h-[130px]">
          <span className="text-caption1  text-main-1">답변</span>
          <p className="flex-1 overflow-scroll text-body2-normal md:text-body1-normal text-text-1 ">
            {inquiryDetail.answer.content}
          </p>
        </div>
      )}

      {!inquiryDetail.answer && (
        <div className="bg-bg-1 border border-divider-1 p-4 md:p-6 flex flex-col items-center justify-center rounded-xl min-h-[130px]">
          <TimerIcon className="mb-3" />
          <p className="text-label1 text-text-3 mb-0.5 md:mb-0">답변 대기 중입니다</p>
          <p className="text-caption1 text-text-4 text-center">
            문의해주신 내용을 확인하고 있어요.
            <br className="md:hidden mb-1" />
            순차적으로 답변드릴게요.
          </p>
        </div>
      )}
    </div>
  );
}
