import { useGetMyInquiries } from '@/shared/api/generated/inquiry-api/inquiry-api';

/** 본인 문의 목록. `page`는 1부터 시작하며 서버 응답의 `page`와 같은 축이다. */
export function useMyInquiries(page: number) {
  return useGetMyInquiries({ page });
}
