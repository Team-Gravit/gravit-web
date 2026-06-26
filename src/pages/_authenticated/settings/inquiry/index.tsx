import { createFileRoute } from '@tanstack/react-router';

import useInfiniteMyInquiries from '@/widgets/inquiry/model/use-infinite-my-inquiries';
import MyInquiriesList from '@/widgets/inquiry/my-inquiries-list';

export const Route = createFileRoute('/_authenticated/settings/inquiry/')({
  component: RouteComponent,
  staticData: {
    pageTitle: '문의내역확인',
  },
});

function RouteComponent() {
  const { data } = useInfiniteMyInquiries();

  return (
    <div className="flex flex-col flex-1 gap-2 md:gap-3">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-headline1 md:text-heading1">
          문의 내역
          <span className="text-main-1 ml-2">{`${data?.pages[0].totalElements || 0}`}</span>
        </h3>
        <span className="text-caption1 text-text-4">최신순</span>
      </div>

      <MyInquiriesList />
    </div>
  );
}
