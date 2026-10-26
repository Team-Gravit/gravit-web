import { useQueryClient } from '@tanstack/react-query';

import { getMyPageBannerQueryKey, getUserProfileQueryKey, getUserQueryKey } from '@/entities/user';
import { useUpdateProfile as useUpdateProfileRequest } from '@/shared/api/generated/user-api/user-api';

interface UseUpdateProfileOptions {
  /** 수정이 성공한 뒤 호출한다. 이동·닫기는 호출한 화면이 결정한다. */
  onSuccess: () => void;
}

/**
 * 프로필(닉네임·색상)을 수정하고, 갱신된 값을 보여주는 캐시를 무효화한다.
 * 세 화면이 각기 다른 리소스 경로에서 프로필을 읽으므로 세 쿼리를 모두 무효화한다
 * (마이페이지 배너 · 메인페이지 프로필 · 헤더/사이드바 유저).
 */
export function useUpdateProfile({ onSuccess }: UseUpdateProfileOptions) {
  const queryClient = useQueryClient();

  return useUpdateProfileRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getMyPageBannerQueryKey() });
        queryClient.invalidateQueries({ queryKey: getUserProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getUserQueryKey() });
        onSuccess();
      },
    },
  });
}
