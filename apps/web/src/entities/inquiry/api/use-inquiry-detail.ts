import { useGetMyInquiryDetail } from '@/shared/api/generated/inquiry-api/inquiry-api';

/**
 * 본인 문의 상세. 목록에서 항목을 펼칠 때만 조회하도록 `enabled`로 가드한다.
 */
export function useInquiryDetail(inquiryId: number, enabled: boolean) {
  return useGetMyInquiryDetail(inquiryId, { query: { enabled } });
}
