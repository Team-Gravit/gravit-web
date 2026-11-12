import { useEffect, useState } from 'react';

import type { NicknameFieldStatus } from '../ui/nickname-field';

import { isValidNickname } from './nickname';

/** 입력이 멈춘 뒤 닉네임을 검사할 때까지 기다리는 시간. */
const NICKNAME_CHECK_DELAY_MS = 300;

/**
 * 닉네임 입력값의 검증 상태를 디바운스로 판정한다.
 * 입력이 멈추고 {@link NICKNAME_CHECK_DELAY_MS} 가 지나야 valid/invalid 를 확정하고,
 * 그 전까지는 checking 으로 둬 타이핑 중 깜빡임을 막는다. 빈 값은 default.
 */
export function useNicknameStatus(nickname: string): NicknameFieldStatus {
  // 입력이 멈춘 뒤 확정된 값. 현재 입력과 다르면 아직 검사 중이다.
  const [settledNickname, setSettledNickname] = useState(nickname);

  useEffect(() => {
    const timer = setTimeout(() => setSettledNickname(nickname), NICKNAME_CHECK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [nickname]);

  if (!nickname) {
    return 'default';
  }

  if (nickname !== settledNickname) {
    return 'checking';
  }

  return isValidNickname(nickname) ? 'valid' : 'invalid';
}
