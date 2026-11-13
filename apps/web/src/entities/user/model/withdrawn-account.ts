import { isAxiosError } from 'axios';

// 서버는 탈퇴(비활성) 계정을 이 코드로 알린다. 로그인 응답에서는 message에 providerId를 담는다.
const WITHDRAWN_ACCOUNT_ERROR = 'USER_423';

interface WithdrawnAccountErrorBody {
  error: typeof WITHDRAWN_ACCOUNT_ERROR;
  message?: unknown;
}

/** 탈퇴 계정 응답이면 오류 본문을, 아니면 `null`을 반환한다. */
export function readWithdrawnAccountError(error: unknown): WithdrawnAccountErrorBody | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const body = error.response?.data as { error?: unknown; message?: unknown } | undefined;

  if (body?.error !== WITHDRAWN_ACCOUNT_ERROR) {
    return null;
  }

  return { error: WITHDRAWN_ACCOUNT_ERROR, message: body.message };
}

export function isWithdrawnAccountError(error: unknown): boolean {
  return readWithdrawnAccountError(error) !== null;
}
