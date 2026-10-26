import { useState } from 'react';

import { FIRST_PROFILE_COLOR_NUMBER, normalizeNickname, useNicknameStatus } from '@/entities/user';

import { useOnboardUser } from '../api/use-onboard-user';

interface UseOnboardingFormOptions {
  /** 등록 성공 후 호출한다. */
  onSuccess: () => void;
}

export function useOnboardingForm({ onSuccess }: UseOnboardingFormOptions) {
  const [colorNumber, setColorNumber] = useState(FIRST_PROFILE_COLOR_NUMBER);
  const [nickname, setNickname] = useState('');

  const { mutate, isPending } = useOnboardUser({ onSuccess });

  const nicknameStatus = useNicknameStatus(nickname);

  const canSubmit = nicknameStatus === 'valid';

  const submit = () => {
    if (!canSubmit || isPending) {
      return;
    }

    mutate({
      data: {
        nickname: normalizeNickname(nickname),
        profilePhotoNumber: colorNumber,
      },
    });
  };

  return {
    colorNumber,
    setColorNumber,
    nickname,
    setNickname,
    nicknameStatus,
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
}
