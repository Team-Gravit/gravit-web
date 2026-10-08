import { Link } from '@tanstack/react-router';

import { infiniteSelector } from '@/shared/lib/query/selector';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';

import useInfiniteMyInquiries from './model/use-infinite-my-inquiries';
import MyInquiriesListItem from './my-inquiries-list-item';

function MyInquiriesList() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteMyInquiries();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
  });

  const inquiries = infiniteSelector(data);

  return (
    <div className="flex-1">
      {!isPending && inquiries.length > 0 && (
        <ul className=" rounded-xl overflow-hidden">
          {inquiries.map((item) => (
            <MyInquiriesListItem key={item.id} inquiry={item} />
          ))}
          {hasNextPage && (
            <li ref={loadMoreRef} className="h-4 w-full shrink-0 rounded-xl" aria-hidden />
          )}
        </ul>
      )}
      {!isPending && inquiries.length === 0 && (
        <div className="w-full rounded-xl h-[300px] bg-white flex flex-col gap-8 items-center justify-center">
          <div className="text-center">
            <p className="text-heading1 mb-3 text-text-2">등록된 문의 내역이 없어요</p>
            <p className="text-headline2 text-text-3-w">
              궁금한 점이 있다면 문의하기를 통해 남겨주세요.
            </p>
          </div>
          <Link
            to={'/settings/inquiry/new'}
            className="bg-cta text-headline2 text-cta-text rounded-lg px-9 py-4"
          >
            문의하기
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyInquiriesList;
