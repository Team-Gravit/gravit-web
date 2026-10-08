import { useQueryClient } from '@tanstack/react-query';

import {
  getGetMyInquiriesQueryKey,
  useSubmitInquiry as useSubmitInquiryMutation,
} from '@/shared/api/generated/inquiry-api/inquiry-api';

/**
 * 문의 제출. 성공하면 목록 캐시를 무효화하고 호출부가 정한 곳으로 이동한다.
 * 이동 목적지는 화면이 정하므로 `onSuccess` 콜백으로 받는다.
 */
export function useSubmitInquiry(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useSubmitInquiryMutation({
    mutation: {
      onSuccess: () => {
        // 인자 없는 팩토리 = 목록 패밀리 키. 모든 페이지 결과를 무효화한다.
        queryClient.invalidateQueries({ queryKey: getGetMyInquiriesQueryKey() });
        onSuccess();
      },
    },
  });
}
