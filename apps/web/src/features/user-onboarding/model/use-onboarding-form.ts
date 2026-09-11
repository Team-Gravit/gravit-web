import { useEffect, useState } from 'react';

import {
  FIRST_PROFILE_COLOR_NUMBER,
  isValidNickname,
  normalizeNickname,
  type NicknameFieldStatus,
} from '@/entities/user';

import { useOnboardUser } from '../api/use-onboard-user';

/** 입력이 멈춘 뒤 닉네임을 검사할 때까지 기다리는 시간. */
const NICKNAME_CHECK_DELAY_MS = 300;

interface UseOnboardingFormOptions {
  /** 등록 성공 후 호출한다. */
  onSuccess: () => void;
}

export function useOnboardingForm({ onSuccess }: UseOnboardingFormOptions) {
  const [colorNumber, setColorNumber] = useState(FIRST_PROFILE_COLOR_NUMBER);
  const [nickname, setNickname] = useState('');
  // 입력이 멈춘 뒤 확정된 값. 현재 입력과 다르면 아직 검사 중이다.
  const [settledNickname, setSettledNickname] = useState('');

  const { mutate, isPending } = useOnboardUser({ onSuccess });

  useEffect(() => {
    const timer = setTimeout(() => setSettledNickname(nickname), NICKNAME_CHECK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [nickname]);

  const nicknameStatus = resolveNicknameStatus({ nickname, settledNickname });

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

interface ResolveNicknameStatusInput {
  nickname: string;
  settledNickname: string;
}

function resolveNicknameStatus({
  nickname,
  settledNickname,
}: ResolveNicknameStatusInput): NicknameFieldStatus {
  if (!nickname) {
    return 'default';
  }

  if (nickname !== settledNickname) {
    return 'checking';
  }

  return isValidNickname(nickname) ? 'valid' : 'invalid';
}
