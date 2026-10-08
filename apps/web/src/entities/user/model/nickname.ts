/** 서버의 온보딩 요청과 동일한 닉네임 규칙. */
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 8;
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;

/** 닉네임 입력값이 규칙에 맞는지 확인한다. */
export function isValidNickname(nickname: string): boolean {
  if (nickname.length < NICKNAME_MIN_LENGTH || nickname.length > NICKNAME_MAX_LENGTH) {
    return false;
  }

  return NICKNAME_PATTERN.test(nickname);
}

/** 전송 전에 닉네임 앞뒤 공백을 제거한다. */
export function normalizeNickname(nickname: string): string {
  return nickname.trim();
}
