import { getGetMyPageBannerQueryKey } from '@/shared/api/@generated/mypage-api/mypage-api';
import {
  getGetMainPageQueryKey,
  useUpdateProfile,
} from '@/shared/api/@generated/user-api/user-api';
import { queryClient } from '@/shared/lib/query-client';

interface UseUpdateProfileMutationProps {
  onSuccess?: () => void;
}

function useUpdateProfileMutation({ onSuccess }: UseUpdateProfileMutationProps = {}) {
  return useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyPageBannerQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMainPageQueryKey() });
        // TODO: 헤더 프로필 이미지 쿼리 무효화 필요
        onSuccess?.();
      },
    },
  });
}

export default useUpdateProfileMutation;
