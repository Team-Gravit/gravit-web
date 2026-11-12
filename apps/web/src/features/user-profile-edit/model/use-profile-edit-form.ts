import { useState } from 'react';

import { normalizeNickname, useNicknameStatus } from '@/entities/user';

import { useUpdateProfile } from '../api/use-update-profile';

interface UseProfileEditFormOptions {
  /** 현재 닉네임. 입력의 초기값이자 변경 여부 판단 기준. */
  initialNickname: string;
  /** 현재 프로필 색상 번호(1~19). */
  initialColorNumber: number;
  /** 수정 성공 후 호출한다. */
  onSuccess: () => void;
}

/**
 * 프로필 수정 폼 상태. 온보딩과 달리 초기값이 있어 **변경 여부**가 제출 조건에 들어간다.
 * 닉네임을 바꾸지 않았으면(기존 값 그대로) 검증 문구를 띄우지 않고 `default` 로 둔다.
 */
export function useProfileEditForm({
  initialNickname,
  initialColorNumber,
  onSuccess,
}: UseProfileEditFormOptions) {
  const [colorNumber, setColorNumber] = useState(initialColorNumber);
  const [nickname, setNickname] = useState(initialNickname);

  const { mutate, isPending } = useUpdateProfile({ onSuccess });

  const rawStatus = useNicknameStatus(nickname);

  const isNicknameChanged = nickname !== initialNickname;
  const isColorChanged = colorNumber !== initialColorNumber;

  // 바꾸지 않은 닉네임에는 「사용 가능」 문구를 띄우지 않는다.
  const nicknameStatus = isNicknameChanged ? rawStatus : 'default';

  // 닉네임을 바꿨으면 유효해야 하고, 안 바꿨으면 기존(유효한) 닉네임을 그대로 쓴다.
  // 색만 바꿔도 제출할 수 있되, 바꾼 닉네임이 무효면 색 변경과 무관하게 막는다.
  const isNicknameUsable = isNicknameChanged ? rawStatus === 'valid' : true;
  const canSubmit = (isNicknameChanged || isColorChanged) && isNicknameUsable;

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
