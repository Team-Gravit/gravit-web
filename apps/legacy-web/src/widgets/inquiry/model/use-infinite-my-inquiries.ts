import { useGetMyInquiriesInfinite } from '@/shared/api/@generated/inquiry-api/inquiry-api';

function useInfiniteMyInquiries() {
  return useGetMyInquiriesInfinite(
    {
      page: 1,
    },
    {
      query: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
      },
    },
  );
}

export default useInfiniteMyInquiries;
