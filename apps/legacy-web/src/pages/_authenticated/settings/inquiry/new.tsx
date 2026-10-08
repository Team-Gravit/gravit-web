import { createFileRoute } from '@tanstack/react-router';

import InquiryForm from '@/widgets/inquiry/inquiry-form';

export const Route = createFileRoute('/_authenticated/settings/inquiry/new')({
  component: RouteComponent,
  staticData: {
    pageTitle: '문의하기',
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h3 className="text-headline2 md:text-heading1">문의유형을 선택해주세요</h3>
      <InquiryForm />
    </div>
  );
}
