import { InquiryForm } from '@/features/inquiry-submit';

/** 문의 작성 화면. legacy `settings/inquiry/new.tsx`의 헤더 + 폼 배치를 그대로 옮겼다. */
export function InquiryNewPage() {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h3 className="pl-1 text-headline2 md:text-heading1">문의유형을 선택해주세요</h3>
      <InquiryForm />
    </div>
  );
}
