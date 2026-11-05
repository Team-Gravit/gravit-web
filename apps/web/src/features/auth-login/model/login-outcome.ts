import { isAxiosError } from 'axios';

import type { LoginResponse } from '@/shared/api/generated/model';

// 서버는 탈퇴 계정의 복구를 이 코드로 알리고, message에 providerId를 담는다.
const WITHDRAWN_ACCOUNT_ERROR = 'USER_423';

/** 서버 문구는 사용자용인지 확인되지 않았고 SDK 오류에는 서버 문구가 없어, 실패 안내를 통일한다. */
export const LOGIN_FAILED_MESSAGE = '로그인에 실패했습니다. 다시 시도해 주세요.';

/** 앱이 이 로그인을 처리하지 못할 때의 안내. 사용자가 할 수 있는 조치는 앱 업데이트뿐이다. */
export const LOGIN_UNSUPPORTED_MESSAGE =
  '해당 로그인을 사용할 수 없습니다. 앱을 업데이트 해주세요.';

/**
 * 로그인 성공 후 갈 곳. 콜백·네이티브 두 진입 경로가 같은 판정을 쓴다.
 */
export function resolveLoginDestination({
  isOnboarded,
}: Pick<LoginResponse, 'isOnboarded'>): '/main' | '/onboarding' {
  return isOnboarded ? '/main' : '/onboarding';
}

/** 탈퇴 계정 응답이면 복구에 쓸 providerId를, 아니면 `null`을 반환한다. */
export function readWithdrawnProviderId(error: unknown): string | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const body = error.response?.data as { error?: string; message?: unknown } | undefined;

  if (body?.error !== WITHDRAWN_ACCOUNT_ERROR || typeof body.message !== 'string') {
    return null;
  }

  return body.message;
}
