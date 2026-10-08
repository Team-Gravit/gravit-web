import { useQueryClient } from '@tanstack/react-query';

import { getUserQueryKey } from '@/entities/user';
import { useOnboardUser as useOnboardUserRequest } from '@/shared/api/generated/user-api/user-api';

interface UseOnboardUserOptions {
  /** 등록이 끝난 뒤 호출한다. 이동은 호출한 화면이 결정한다. */
  onSuccess: () => void;
}

/** 온보딩 정보를 등록하고 사용자 조회 캐시를 갱신한다. */
export function useOnboardUser({ onSuccess }: UseOnboardUserOptions) {
  const queryClient = useQueryClient();

  return useOnboardUserRequest({
    mutation: {
      onSuccess: (user) => {
        queryClient.setQueryData(getUserQueryKey(), user);
        onSuccess();
      },
    },
  });
}
