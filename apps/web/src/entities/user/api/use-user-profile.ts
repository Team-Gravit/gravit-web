import { useGetProfile } from '@/shared/api/generated/mainpage-api/mainpage-api';

import type { UserProfile } from '../model/types';

/**
 * `useUser`와 닉네임·아바타가 겹치지만, 이 훅은 레벨·XP가 필요한 화면에서 사용한다.
 * 프로필을 수정하면 `getUserQueryKey()`와 `getUserProfileQueryKey()`를 모두 무효화해야 한다.
 */
export function useUserProfile() {
  return useGetProfile({
    query: {
      select: ({ nickname, profileImgNumber, userLevelDetailResponse }): UserProfile => ({
        nickname,
        profileImageNumber: profileImgNumber,
        level: userLevelDetailResponse.level,
        currentXp: userLevelDetailResponse.currentXp,
        maxXp: userLevelDetailResponse.maxXp,
      }),
    },
  });
}
