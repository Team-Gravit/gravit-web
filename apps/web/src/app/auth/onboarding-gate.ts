import { isAxiosError } from 'axios';

/** 토큰은 유효하지만 계정이 없을 때 서버가 주는 코드. 온보딩 전 사용자는 200으로 응답받는다. */
const USER_NOT_FOUND_ERROR = 'USER_4041';

/**
 * 계정이 없어 다시 시도해도 소용없는 실패인지 판별한다.
 *
 * 상태 코드 404로 보면 게이트웨이의 404에도 사용자가 로그아웃되므로 서버 에러 코드로 본다.
 */
export function isUserNotFoundError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  const body = error.response?.data as { error?: string } | undefined;

  return body?.error === USER_NOT_FOUND_ERROR;
}

/**
 * 세션은 남아 있지만 사용자 조회가 실패해 온보딩 완료 여부를 판정할 수 없다.
 *
 * 자식 라우트의 렌더 에러도 같은 `errorComponent`로 올라오므로 표식으로 구분한다.
 */
export class UserCheckFailedError extends Error {
  constructor(cause: unknown) {
    super('사용자 조회에 실패해 온보딩 완료 여부를 판정할 수 없습니다', { cause });
    this.name = 'UserCheckFailedError';
  }
}

/** 현재 경로에 머물 수 없으면 이동할 경로를, 머물 수 있으면 `null`을 반환한다. */
export function getOnboardingRedirect(
  pathname: string,
  isOnboarded: boolean,
): '/main' | '/onboarding' | null {
  const isOnboardingForm = pathname.replace(/\/$/, '') === '/onboarding';

  if (isOnboarded) {
    return isOnboardingForm ? '/main' : null;
  }

  return isOnboardingForm ? null : '/onboarding';
}
