import { isAxiosError } from 'axios';

// 토큰 자체는 유효하지만 주인이 탈퇴했거나 없는 계정일 때 서버가 401과 함께 주는 코드.
const WITHDRAWN_USER_TOKEN_ERROR = 'JWT_4017';

/** 탈퇴했거나 존재하지 않는 사용자의 토큰이라 재발급해도 소용없는 401인지 판별한다. */
export function isWithdrawnUserTokenError(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    return false;
  }

  const body = error.response.data as { error?: unknown } | undefined;

  return body?.error === WITHDRAWN_USER_TOKEN_ERROR;
}
